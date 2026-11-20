import { CalendarCheck, ScanFace, Webcam } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandMark } from "../BrandMark";
import { NodeTile } from "./NodeTile";
export function FaceNodes() {
  const { t } = useTranslation();
  return (
    <div className="node-stage">
      <div className="node-row">
        <NodeTile icon={Webcam} label={t("nodes.webcam")} index={0} />
        <NodeTile
          icon={ScanFace}
          label={t("nodes.faceMatch")}
          variant="hybrid"
          index={1}
          hint="ArcFace"
        />
        <NodeTile
          icon={CalendarCheck}
          label={t("nodes.attendance")}
          variant="support"
          index={2}
        />
      </div>
      <div className="brand-row">
        <div className="brand-chip">
          <BrandMark name="Python" />
        </div>
        <div className="brand-chip">
          <BrandMark name="Flask" />
        </div>
        <div className="brand-chip">
          <BrandMark name="OpenCV" />
        </div>
        <div className="brand-chip">
          <BrandMark name="SQLite" />
        </div>
      </div>
    </div>
  );
}
