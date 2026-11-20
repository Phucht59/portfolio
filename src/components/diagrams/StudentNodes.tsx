import { BarChart3, Database, Share2, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandMark } from "../BrandMark";
import { NodeTile } from "./NodeTile";
export function StudentNodes() {
  const { t } = useTranslation();
  return (
    <div className="node-stage">
      <div className="node-grid">
        <NodeTile
          icon={Database}
          label={t("nodes.data")}
          index={0}
          hint="UCI + OULAD"
        />
        <div className="node-row">
          <NodeTile
            icon={Share2}
            label={t("nodes.hybrid")}
            variant="hybrid"
            index={1}
            hint="CNN ∥ BiLSTM"
          />
          <NodeTile
            icon={BarChart3}
            label={t("nodes.risk")}
            variant="risk"
            index={2}
            hint="Probability"
          />
        </div>
        <NodeTile
          icon={UserRound}
          label={t("nodes.support")}
          variant="support"
          index={3}
          hint="Ranking"
        />
      </div>
      <div className="brand-row">
        <div className="brand-chip">
          <BrandMark name="Python" />
        </div>
        <div className="brand-chip">
          <BrandMark name="PyTorch" />
        </div>
        <div className="brand-chip">
          <BrandMark name="PostgreSQL" />
        </div>
      </div>
    </div>
  );
}
