/**
 * 공공데이터포털(data.go.kr) - 한국대학교육협의회 대학알리미 API 연동
 * 활용신청: https://www.data.go.kr/data/15037507/openapi.do (대학기본정보 - 대학 코드조회)
 *         https://www.data.go.kr/data/15037346/openapi.do (학생현황 - 정원내 신입생 경쟁률)
 *
 * schlId(학교코드): [대학정보공시 > 대학 코드조회 API]로 확인 가능.
 * 경쟁률 API(StudentService)는 schlId 7자리 형식(예: 0000035)을 사용합니다.
 */

import http from 'http';
import { XMLParser } from 'fast-xml-parser';

// 공공데이터 대학알리미 API
// - BasicInformationService/getUniversityCode: 대학 코드조회 (대학 검색목록)
// - StudentService/getComparisonInsideFixedNumberFreshmanCompetitionRate: 정원내 신입생 경쟁률
const BASE_URL = 'http://openapi.academyinfo.go.kr/openapi/service/rest';
const parser = new XMLParser({ ignoreAttributes: false });

function getServiceKey(): string | null {
  const key = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!key || key === '') return null;
  // 공공데이터 API: 일반 인증키(decoding) 사용 시 인코딩 필요
  // 일반 인증키(encoding) 사용 시 인코딩 불필요 (이미 인코딩됨)
  // .env에 인코딩된 키를 넣었다면 그대로 사용, 디코딩된 키라면 인코딩 필요
  // 일단 원본 키를 그대로 사용 (공공데이터 API가 자동 처리)
  return key;
}

// API 호출 공통 함수
async function callApi<T>(path: string, params: Record<string, string | number> = {}): Promise<T | null> {
  const serviceKey = getServiceKey();
  if (!serviceKey) return null;

  // 공공데이터 API는 serviceKey (소문자 s) 파라미터명 사용
  const base: Record<string, string> = { serviceKey: serviceKey };
  Object.entries(params).forEach(([k, v]) => {
    base[k] = String(v);
  });
  const searchParams = new URLSearchParams(base);
  const url = `${BASE_URL}/${path}?${searchParams.toString()}`;

  try {
    const { xml: bodyText, statusCode } = await new Promise<{ xml: string; statusCode: number }>((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ xml: data, statusCode: res.statusCode ?? 0 }));
      });
      req.on('error', reject);
      req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    });

    const trimmed = bodyText.trim();
    if (statusCode !== 200) {
      console.warn('[공공데이터 API] HTTP', statusCode, '| path:', path, '| body:', trimmed.substring(0, 200));
      return null;
    }
    if (!trimmed || trimmed.startsWith('<') === false || trimmed.includes('<html') || trimmed.includes('<!DOCTYPE')) {
      const preview = trimmed ? trimmed.substring(0, 400) : '(빈 응답)';
      console.warn('[공공데이터 API] XML이 아님. | body:', preview);
      return null;
    }

    const json = parser.parse(bodyText);
    let response = json?.response;
    if (!response) {
      // 에러 응답 (OpenAPI_ServiceResponse)
      const errResp = json?.OpenAPI_ServiceResponse ?? json?.openAPI_ServiceResponse;
      const errHeader = errResp?.cmmMsgHeader ?? errResp?.CmmMsgHeader;
      if (errHeader) {
        const errMsg = errHeader.errMsg ?? errHeader.returnAuthMsg ?? errHeader.errmsg ?? 'API 에러';
        console.warn('[공공데이터 API] 에러 응답:', errMsg);
        return null;
      }
      console.warn('[공공데이터 API] response 없음. 파싱결과:', JSON.stringify(json).substring(0, 300));
      return null;
    }

    const header = response.header ?? response.Header;
    const body = response.body ?? response.Body;
    const resultCode =
      header?.resultCode ?? header?.ResultCode ?? header?.resultcode ?? body?.resultCode ?? body?.ResultCode ?? body?.resultcode ?? response?.resultCode ?? response?.ResultCode;

    // 성공: '00', '0', 0 (공공데이터 API가 숫자 0 또는 문자열로 반환)
    const isSuccess = resultCode === '00' || resultCode === '0' || resultCode === 0;
    if (!isSuccess) {
      const msg = header?.resultMsg ?? header?.ResultMsg ?? body?.resultMsg ?? body?.ResultMsg ?? '알 수 없음';
      console.warn('[공공데이터 API] resultCode:', resultCode ?? 'undefined', 'msg:', msg, '| path:', path);
      // 디버그: 파싱 구조 확인 (환경변수 DEBUG_PUBLIC_DATA=1 일 때)
      if (process.env.DEBUG_PUBLIC_DATA === '1') {
        console.warn('[공공데이터 API] 파싱 구조:', JSON.stringify({ header: !!header, body: !!body, keys: Object.keys(response) }));
      }
      return null;
    }
    return body as T;
  } catch (err) {
    console.error('[공공데이터 API] 오류:', err);
    return null;
  }
}

// 대학 검색목록 응답 타입
interface SchoolListItems {
  item?: SchoolItem | SchoolItem[];
  Item?: SchoolItem | SchoolItem[];
}
interface SchoolListResponse {
  totalCount?: number;
  numOfRows?: number;
  pageNo?: number;
  items?: SchoolListItems;
  Items?: SchoolListItems;
}
interface SchoolItem {
  schlId?: string;
  schlID?: string;
  schlKrnNm?: string;
  schlKRNNM?: string;
}

// 정원내 신입생 경쟁률 응답 타입
interface CompetitionRateItem {
  schlId?: string;
  schlKrnNm?: string;
  schlKRNNM?: string;
  indctVal1?: string;
  indctVAL1?: string;
  svyYr?: string;
  svyYR?: string;
}
interface CompetitionRateResponse {
  totalCount?: number;
  items?: { item?: CompetitionRateItem | CompetitionRateItem[] };
  Items?: { item?: CompetitionRateItem | CompetitionRateItem[]; Item?: CompetitionRateItem | CompetitionRateItem[] };
  item?: CompetitionRateItem | CompetitionRateItem[];
  Item?: CompetitionRateItem | CompetitionRateItem[];
}

/** API 키 설정 여부 */
export function isPublicDataEnabled(): boolean {
  return !!getServiceKey();
}

/**
 * 대학 검색목록 조회 (대학비교통계)
 * 대학 ID(schlId)와 한글명을 반환 - 경쟁률 조회 시 schlId 사용
 */
export async function getUniversityListFromPublic(svyYr: string = '2024', pageNo: number = 1): Promise<Array<{ id: string; name: string }> | null> {
  // 대학 코드 조회 (대학 검색목록)
  const body = await callApi<SchoolListResponse>(
    'BasicInformationService/getUniversityCode',
    { svyYr, pageNo, numOfRows: 500 }
  );
  const items = body?.items ?? body?.Items;
  const rawItem = items?.item ?? items?.Item;
  if (!rawItem) return null;

  const list = Array.isArray(rawItem) ? rawItem : [rawItem];
  return list
    .filter((x) => x?.schlId || x?.schlID)
    .map((x) => ({ id: x.schlId ?? x.schlID ?? '', name: x.schlKrnNm ?? x.schlKRNNM ?? '' }))
    .filter((x) => x.id && x.name);
}

// 대학알리미 schlId 매핑 (API 실패 시 폴백)
const SCHL_ID_FALLBACK: Record<string, string> = {
  서울대학교: '0000149',
  연세대학교: '0000027',
  고려대학교: '0000028',
  성균관대학교: '0000029',
  한양대학교: '0000035',
  중앙대학교: '0000036',
  경희대학교: '0000037',
  한국외국어대학교: '0000038',
  서강대학교: '0000039',
  이화여자대학교: '0000040',
  건국대학교: '0000041',
  동국대학교: '0000042',
};

/**
 * 대학명으로 schlId 조회
 */
export async function findSchoolIdByName(universityName: string): Promise<string | null> {
  const list = await getUniversityListFromPublic('2024', 1);
  if (list) {
    const found = list.find(
      (x) => x.name === universityName || x.name.replace(/\s/g, '') === universityName.replace(/\s/g, '')
    );
    if (found?.id) {
      console.log('[공공데이터] 대학코드 조회(API):', universityName, '->', found.id);
      return found.id;
    }
  }
  const fallback = SCHL_ID_FALLBACK[universityName] ?? null;
  if (fallback) {
    console.log('[공공데이터] 대학코드 조회(폴백):', universityName, '->', fallback);
  } else {
    console.log('[공공데이터] 대학코드 없음:', universityName);
  }
  return fallback;
}

/**
 * 정원내 신입생 경쟁률 조회 (대학비교통계)
 */
export async function getFreshmanCompetitionRate(schlId: string, svyYr: string = '2024'): Promise<{
  universityName: string;
  year: string;
  rate: string;
} | null> {
  // 정원내 신입생 경쟁률 조회 (대학비교통계)
  const body = await callApi<CompetitionRateResponse>(
    'StudentService/getComparisonInsideFixedNumberFreshmanCompetitionRate',
    { schlId, svyYr }
  );
  if (!body) {
    console.log('[공공데이터] 경쟁률 API body 없음, schlId:', schlId);
    return null;
  }
  // 응답 구조: body.items.item | body.items (배열) | body.items 내부가 다른 키명(item/Item 등)
  const items = body?.items ?? (body as { Items?: unknown })?.Items;
  let rawItem: CompetitionRateItem | CompetitionRateItem[] | undefined =
    (items as { item?: CompetitionRateItem | CompetitionRateItem[] })?.item ??
    (items as { Item?: CompetitionRateItem | CompetitionRateItem[] })?.Item;
  if (!rawItem && body) {
    rawItem = (body as CompetitionRateResponse).item ?? (body as CompetitionRateResponse).Item;
  }
  if (!rawItem && Array.isArray(items)) {
    rawItem = items.length > 0 ? (items[0] as CompetitionRateItem) : undefined;
  }
  // body.items가 객체인데 item/Item 외 다른 키명인 경우
  if (!rawItem && items && typeof items === 'object' && !Array.isArray(items)) {
    const inner = items as Record<string, unknown>;
    const keys = Object.keys(inner);
    const itemKey = keys.find((k) => k.toLowerCase() === 'item');
    if (itemKey) {
      const val = inner[itemKey];
      rawItem = Array.isArray(val) ? (val.length > 0 ? (val[0] as CompetitionRateItem) : undefined) : (val as CompetitionRateItem);
    }
    // item 키가 없으면 값 중 배열/객체인 것의 첫 항목 사용 (공공데이터 XML 파싱 차이 대응)
    if (!rawItem) {
      for (const k of keys) {
        const val = inner[k];
        if (Array.isArray(val) && val.length > 0 && val[0] && typeof val[0] === 'object') {
          rawItem = val[0] as CompetitionRateItem;
          break;
        }
        if (val && typeof val === 'object' && !Array.isArray(val) && ((val as CompetitionRateItem).schlKrnNm != null || (val as CompetitionRateItem).indctVal1 != null)) {
          rawItem = val as CompetitionRateItem;
          break;
        }
      }
    }
  }
  if (!rawItem) {
    console.log('[공공데이터] 경쟁률 item 없음, body 키:', Object.keys(body || {}).join(', '), 'items 키:', items && typeof items === 'object' ? Object.keys(items as object).join(', ') : 'n/a');
    return null;
  }

  const first: CompetitionRateItem = Array.isArray(rawItem) ? rawItem[0] : rawItem;
  const universityName = first?.schlKrnNm ?? first?.schlKRNNM;
  if (!universityName) return null;

  return {
    universityName,
    year: first.svyYr ?? first.svyYR ?? svyYr,
    rate: first.indctVal1 ?? first.indctVAL1 ?? '-',
  };
}

/**
 * schlId를 7자리 형식으로 맞춤 (경쟁률 API는 7자리 사용, 예: 0000035)
 * API/폴백에서 숫자로 올 수 있으므로 문자열로 변환 후 처리.
 */
function normalizeSchlId(schlId: string | number): string {
  const s = typeof schlId === 'string' ? schlId : String(schlId);
  const n = s.replace(/\D/g, '');
  if (n.length >= 7) return n.slice(0, 7);
  return n.padStart(7, '0');
}

/** 경쟁률 조회 시 시도할 연도: 올해부터 과거로 (직전 연도 우선) */
function getYearsToTry(): string[] {
  const current = new Date().getFullYear();
  const years: string[] = [];
  for (let y = current; y >= 2022; y--) years.push(String(y));
  return years;
}

/**
 * 대학명으로 경쟁률 조회 (schlId 자동 조회 후 호출)
 * 가능한 최근 연도부터 시도해, 데이터가 있는 직전 연도 결과를 반환합니다.
 */
export async function getUniversityStatsByName(universityName: string): Promise<{
  universityName: string;
  year: string;
  competitionRate: string;
} | null> {
  const apiSchlId = await findSchoolIdByName(universityName);
  const fallbackSchlId = SCHL_ID_FALLBACK[universityName] ?? null;

  const idsToTry = [
    apiSchlId ? normalizeSchlId(apiSchlId) : null,
    fallbackSchlId,
  ].filter((id): id is string => !!id && id.length > 0);
  const uniqueIds = [...new Set(idsToTry)];
  const yearsToTry = getYearsToTry();

  for (const schlId of uniqueIds) {
    for (const svyYr of yearsToTry) {
      const result = await getFreshmanCompetitionRate(schlId, svyYr);
      if (result) {
        console.log('[공공데이터] 경쟁률 조회 성공(서비스):', result.universityName, result.year, result.rate, 'schlId:', schlId);
        return {
          universityName: result.universityName,
          year: result.year,
          competitionRate: result.rate,
        };
      }
    }
  }

  console.log('[공공데이터] getUniversityStatsByName 실패: 경쟁률 API 결과 없음', universityName, '시도한 schlId:', uniqueIds);
  return null;
}
