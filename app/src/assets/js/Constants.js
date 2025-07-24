const initProduct = {
  name: "",
  description: "",
  mainCategory: "",
  subCategory: "",
  encodedImage: "",
  previewImage: [],
  cost: 0,
  price: 0,
  quantity: 0,
};

const categoryDropdowns = [
  { id: "outer", title: "아우터", items: ["자켓", "점퍼", "코트"] },
  { id: "top", title: "상의", items: ["티셔츠", "블라우스/셔츠", "민소매탑"] },
  { id: "knitwear", title: "니트", items: ["니트", "가디건", "베스트"] },
  {
    id: "dress",
    title: "원피스",
    items: ["미디/롱원피스", "미니원피스", "민소매탑나시원피스"],
  },
  {
    id: "pants",
    title: "바지",
    items: ["데님", "슬렉스", "점프수트", "트레이닝/조거"],
  },
  {
    id: "shoes",
    title: "신발",
    items: ["플랫", "로퍼/블로퍼", "힐/부츠", "운동화/장화", "샌들/슬리퍼"],
  },
  {
    id: "acs",
    title: "악세사리",
    items: [
      "쥬얼리",
      "모자/헤어악세사리",
      "선글라스",
      "스윔웨어",
      "이너웨어",
      "양말/벨트",
      "기타",
    ],
  },
  {
    id: "category",
    title: "ALL",
    items: ["ALL", "공지사항", "상품문의", "배송문의", "반품문의"],
  },
];

const postCategory = [
  {
    id: "community",
    title: "COMMUNITY",
    items: ["공지사항", "상품문의", "배송문의", "반품문의"],
  },
];

const initProductDeatilTableHeaders = [
  "ID",
  "이름",
  "설명",
  "원가",
  "판매가",
  "재고",
  "카테고리",
  "판매량",
  "오늘배송",
];

const settings = {
  centerMode: true, // 중앙에 이미지를 배치
  dots: false, // 슬라이더 하단 작은 점 유무
  autoplay: true, //  일정 시간마다 자동으로 넘어감
  autoplaySpeed: 4000, // 넘어가는 시간 설정 (4초)
  dotsClass: "slick-dots slick-thumb",
  infinite: true, // 슬라이더의 마지막 컨텐츠와 처음을 연결할 것인지
  speed: 500, // 컨텐츠 전환 속도로, 값이 작을 수록 속도가 빠름
  slidesToShow: 1, // 열의 개수
  slidesToScroll: 1, // 한 번에 넘어가는 컨텐츠의 개수
  fade: true,
};

export const PRODUCT_DETAIL_SETTING = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true, // 자동 재생 켜기
  autoplaySpeed: 3000, // 3초마다 자동으로 슬라이드 전환
};

// 메인 페이지
const productsTitle = [
  { title: "BEST ITEM", additional: "가장 사랑을 받은 아이템" },
  { title: "NEW ITEM", additional: "이번 주 새로나온 아이템" },
];

// 페이지 당 보여지는 상품 개수
export const PAGE = {
  CATEGORY: 8,
  WISH_LIST: 3,
};

export const PRODUCT = {
  MAIN: productsTitle,
  DETAIL: initProduct,
  CATEGORY: categoryDropdowns,
  TABLE_HEADERS: initProductDeatilTableHeaders,
  TOTAL_PRODUCT_CONTROL_TAP_INDEX: 0,
  ADD_PRODUCT_TAP_INDEX: 1,
  EDIT_PRODUCT_TAB_INDEX: 2,
  MAIN_IMAGE_INDEX: 0,
  SUB_IMAGE_INDEX: 1,
  PURCHASE_QUANTITY: 1,
  SLIDER_SETTING: settings,
  BEST: 0,
  NEW: 1,
};

const validationCriteria = {
  // eslint-disable-next-line
  id: /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/,
  // eslint-disable-next-line
  password:
    /^(?=.*[a-z])(?=.*\d)(?!.*(\d)\1)(?=.*[!@#\$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
  // eslint-disable-next-line
  name: /^[가-힣a-zA-Z]{2,}$/,
};

const USER = {
  id: "",
  password: "",
  name: "",
  address: "",
  birth: "",
  path: "",
};

export const PURCHASE = {
  EDIT_USER: 0,
  WISH_LIST: 1,
  CART: 2,
  DELIVERY_STATUS: 3,
};

export const SIGNUP = {
  VALIDATION_CRITERIA: validationCriteria,
  ADDRESS_DAUM_POST_URL:
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js",
  INIT_USER: USER,
};

const signup_message = {
  FAIL: "회원가입에 실패했습니다. 다시 제출해주세요.",
  BAD: "유효성 검사에 실패했습니다.",
  BAD_AUTHENTICATE: "본인 인증에 실패하셨습니다.",
  IS_NULL_FIELD: "이 필드는 필수 입력 항목입니다.",
  IS_NULL: "입력하지 않은 항목이 있습니다.",
  NOT_SAME: "비밀번호가 일치하지 않습니다.",
  IS_DUPLICATE: "이미 가입된 이메일입니다. 다른 이메일을 입력해주세요.",
  NOT_AUTHENTICATE_USER: "본인 인증을 해야합니다.",
  NOT_CHECK_BTN: "아이디 중복 검사를 해야합니다",
  GOOD_EMAIL: "사용 가능한 아이디입니다",
  GOOD_AUTHENTICATE: "본인 인증에 성공하셨습니다.",
};

export const SUCCESS = {
  INSERT_REVIEW: "리뷰 등록 완료!",
  INSERT_WISHLIST: "찜 완료!",
  DELETE_WISHLIST: "찜 해제 완료!",
  INSERT_ORDER: "결제가 완료되었습니다.\n - 결제 미구현 - ",
  INSERT_POST: "글 등록 완료!",
};

export const NOTION = {
  JOIN_MEMBERSHIP: "회원이 아닙니다.\n 로그인을 하시겠습니까?",
  DELETE_WISHLIST: "찜을 해제하시겠습니까?",
  GO_TO_CART: "장바구니로 이동하시겠습니까?",
};

export const ERROR = {
  TEXT_KR: 0,
  TEXT_EN: 1,
  FAIL_COMMUNICATION: ["실패했습니다.", "Fail communication"],
  FAIL_LOGIN: ["[로그인 실패]\n다시 시도해주세요.", "FAIL LOGIN"],
  FAIL_SELECT_USER: [
    "[해당 회원에 대한 정보가 없습니다.]\n다시 시도해주세요.",
    "FAIL SEARCH USER",
  ],
  NO_PERMISSTION: ["관리 권한이 없습니다.", "No permission"],
  NON_PRODUCT: ["검색된 상품이 없습니다.", "products is null"],
  FAIL_SELECT_REVIEW: [
    "[리뷰 검색 실패]\n다시 시도해주세요",
    "FAIL SEARCH REVIEW",
  ],
  FAIL_INSERT_REVIEW: [
    "[리뷰 등록 실패]\n다시 시도해주세요.",
    "FAIL INSERT REVIEW",
  ],
  FAIL_INSERT_WISHLIST: [
    "[찜 등록 실패]\n다시 시도해주세요.",
    "FAIL INSERT WISH LIST",
  ],
  FAIL_DELETE_WISHLIST: [
    "[찜 해제 실패]\n다시 시도해주세요.",
    "FAIL DELETE WISH LIST",
  ],
  FAIL_INSERT_CART: [
    "[장바구니 등록 실패]\n다시 시도해주세요.",
    "FAIL INSERT CART",
  ],
  FAIL_DELETE_CART: [
    "[장바구니 해제 실패]\n다시 시도해주세요.",
    "FAIL DELETE CART",
  ],
  FAIL_INSERT_POST: ["[글 등록 실패]\n다시 시도해주세요.", "FAIL INSERT POST"],
  FAIL_INSERT_ORDER: ["[결제 실패]\n다시 시도해주세요.", "FAIL INSERT ORDER"],
  NONE_PRODUCT_DESCRIPTION: "상세 정보가 없습니다.",
  SIGNUP: signup_message,
};

export const LOGIN = {
  ACCESS_TOKEN: "accessToken",
  ADMIN: "ADMIN",
  LOGOUT_ALTER: "로그아웃을 하시겠습니까?",
  LOGOUT_MSG: "로그아웃이 완료되었습니다",
};

export const ROUTE = {
  MAIN: "/",
};

export const BOARD = {
  CATEGORY: postCategory,
};

export const POST_LINK = {
  GITHUB: "https://github.com", // 깃허브
  VLOG: "https://www.notion.so/1d7b5d9916058052b367f49ec9676644?source=copy_link", // 프로젝트에 대한 설명서
};

export const SVG_PATH = {
  LINK: "http://www.w3.org/2000/svg",
  CIRCLE:
    "M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94",
  CART: "M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
};
