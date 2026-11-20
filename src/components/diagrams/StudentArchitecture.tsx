import { useId } from "react";
import { useTranslation } from "react-i18next";
export function StudentArchitecture() {
  const { i18n } = useTranslation();
  const vi = i18n.language.startsWith("vi");
  const id = useId();
  const boxes = [
    [14, 40, 160, vi ? "Đặc trưng dạng bảng" : "Tabular features"],
    [220, 40, 160, vi ? "Nhánh bảng" : "Tabular branch"],
    [14, 157, 160, vi ? "Chuỗi thời gian" : "Temporal sequence"],
    [220, 157, 160, "Temporal adapter"],
    [442, 99, 114, "CNN"],
    [442, 185, 114, "BiLSTM"],
    [592, 123, 122, "Softmax fusion"],
    [756, 123, 188, vi ? "Xác suất rủi ro" : "Risk probability"],
    [756, 193, 188, vi ? "Ngưỡng → hỗ trợ" : "Threshold → support"],
  ] as const;
  const paths = [
    "M174 62H220",
    "M380 62H653V123",
    "M174 179H220",
    "M380 179H410V121H442",
    "M410 179V207H442",
    "M556 121H573V137H592",
    "M556 207H573V153H592",
    "M714 145H756",
    "M850 167V193",
  ];
  return (
    <figure className="surface surface--diagram">
      <div
        className="arch-scroll"
        tabIndex={0}
        aria-label={
          vi
            ? "Sơ đồ kiến trúc, cuộn ngang trên màn hình nhỏ"
            : "Architecture diagram, scroll horizontally on small screens"
        }
      >
        <svg
          className="arch-svg"
          viewBox="0 0 960 250"
          role="img"
          aria-labelledby={id}
        >
          <title id={id}>
            {vi
              ? "Nhánh bảng và hai nhánh CNN, BiLSTM hợp nhất trước khi dự đoán rủi ro và định tuyến hỗ trợ."
              : "The tabular branch and parallel CNN and BiLSTM branches fuse before risk prediction and support routing."}
          </title>
          <defs>
            <marker
              id={id + "-arrow"}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 5L0 10Z" fill="#167d8d" />
            </marker>
          </defs>
          {paths.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="#167d8d"
              strokeWidth="1.6"
              markerEnd={"url(#" + id + "-arrow)"}
            />
          ))}
          {boxes.map(([x, y, w, label]) => (
            <g key={label}>
              <rect
                x={x}
                y={y}
                width={w}
                height="44"
                rx="7"
                className="arch-box"
              />
              <text
                x={x + w / 2}
                y={y + 26}
                textAnchor="middle"
                className="arch-label"
              >
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="arch-legend">
        {vi
          ? "Sơ đồ tóm tắt. Đặc trưng tĩnh và tổng hợp đi qua nhánh bảng; chuỗi thời gian đi qua CNN và BiLSTM song song. Kết quả hỗ trợ là xếp hạng, không chứng minh tác động nhân quả."
          : "Simplified architecture. Static and aggregate features use the tabular branch; temporal sequences feed parallel CNN and BiLSTM branches. Support ranking does not establish causal intervention impact."}
      </figcaption>
    </figure>
  );
}
