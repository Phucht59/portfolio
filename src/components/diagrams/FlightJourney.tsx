import { useTranslation } from "react-i18next";
export function FlightJourney({ steps }: { steps: string[] }) {
  const { i18n } = useTranslation();
  const vi = i18n.language.startsWith("vi");
  const titles = vi
    ? ["Tìm chuyến", "Chuẩn bị đặt vé", "Hoàn tất"]
    : ["Discover", "Prepare booking", "Complete"];
  const labels = vi
    ? [
        "Tìm kiếm",
        "Chọn chuyến",
        "Giữ ghế",
        "Thông tin hành khách",
        "Kiểm tra checkout",
        "Thanh toán mô phỏng",
        "Vé điện tử",
      ]
    : steps.length
      ? steps
      : [
          "Search",
          "Select",
          "Seat hold",
          "Passenger details",
          "Simulated payment",
          "E-ticket",
        ];
  const groups = [labels.slice(0, 2), labels.slice(2, 4), labels.slice(4)];
  return (
    <figure
      className="surface explain-grid"
      aria-label={vi ? "Hành trình đặt vé" : "Booking journey"}
    >
      {groups.map((group, i) => (
        <div key={titles[i]}>
          <span className="label">0{i + 1}</span>
          <h3>{titles[i]}</h3>
          <p>{group.join(" → ")}</p>
          {i === 2 ? (
            <small>
              {vi
                ? "Dự án học tập: không mô tả thanh toán như dịch vụ giao dịch thật."
                : "Academic project: payment is not presented as a live transaction service."}
            </small>
          ) : null}
        </div>
      ))}
    </figure>
  );
}
