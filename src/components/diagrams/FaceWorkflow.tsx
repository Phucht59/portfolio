import { useTranslation } from "react-i18next";
export function FaceWorkflow({ steps }: { steps: string[] }) {
  const { i18n } = useTranslation();
  const vi = i18n.language.startsWith("vi");
  const titles = vi
    ? ["Chuẩn bị", "Nhận diện", "Ghi nhận"]
    : ["Prepare", "Recognize", "Record"];
  const labels = vi
    ? [
        "Ảnh đã đăng ký",
        "Ảnh webcam",
        "Phát hiện và căn chỉnh",
        "Embedding ArcFace",
        "Đối sánh cosine",
        "Check-in / check-out",
      ]
    : steps.length
      ? steps
      : [
          "Enrolled reference",
          "Webcam capture",
          "Detect and align",
          "ArcFace embedding",
          "Cosine match",
          "Check-in / check-out",
        ];
  const groups = [labels.slice(0, 2), labels.slice(2, 5), labels.slice(5)];
  return (
    <figure
      className="surface explain-grid"
      aria-label={vi ? "Quy trình điểm danh" : "Attendance workflow"}
    >
      {groups.map((group, i) => (
        <div key={titles[i]}>
          <span className="label">0{i + 1}</span>
          <h3>{titles[i]}</h3>
          <p>{group.join(" → ")}</p>
        </div>
      ))}
    </figure>
  );
}
