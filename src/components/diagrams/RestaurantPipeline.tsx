import { useTranslation } from "react-i18next";
export function RestaurantPipeline() {
  const { i18n } = useTranslation();
  const vi = i18n.language.startsWith("vi");
  const groups = vi
    ? [
        [
          "Truy xuất song song",
          "BM25 tìm từ khóa; Sentence Transformer và FAISS tìm theo ngữ nghĩa.",
          "Hai nhánh truy xuất trên tập đánh giá Yelp.",
        ],
        [
          "Hợp nhất thứ hạng",
          "Weighted RRF kết hợp danh sách kết quả từ hai nhánh.",
          "Không trình bày FAISS như bước chạy sau BM25.",
        ],
        [
          "Giải thích kết quả",
          "LinearSVC, VADER và phân tích khía cạnh bổ sung góc nhìn cảm xúc.",
          "Hiển thị tìm kiếm và phân tích trong Streamlit.",
        ],
      ]
    : [
        [
          "Parallel retrieval",
          "BM25 finds lexical matches; Sentence Transformer and FAISS retrieve semantic matches.",
          "Two retrieval branches over Yelp reviews.",
        ],
        [
          "Rank fusion",
          "Weighted RRF combines ranked results from both retrieval branches.",
          "FAISS is not a sequential step after BM25.",
        ],
        [
          "Result context",
          "LinearSVC, VADER and aspect analysis add sentiment context.",
          "Search and analysis are presented through Streamlit.",
        ],
      ];
  return (
    <figure
      className="surface explain-grid"
      aria-label={vi ? "Luồng tìm kiếm nhà hàng" : "Restaurant search pipeline"}
    >
      {groups.map(([title, body, note], i) => (
        <div key={title}>
          <span className="label">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{body}</p>
          <small>{note}</small>
        </div>
      ))}
    </figure>
  );
}
