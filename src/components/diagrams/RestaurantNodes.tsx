import { Database, ListFilter, MessageSquare, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandMark } from "../BrandMark";
import { NodeTile } from "./NodeTile";
export function RestaurantNodes() {
  const { t } = useTranslation();
  const nodes = [
    { id: "query", icon: Search, variant: "default" as const },
    { id: "retrieve", icon: Database, variant: "hybrid" as const },
    { id: "rank", icon: ListFilter, variant: "default" as const },
    { id: "sentiment", icon: MessageSquare, variant: "support" as const },
  ];
  return (
    <div className="node-stage">
      <div className="node-row node-row--pipeline">
        {nodes.map((node, index) => (
          <NodeTile
            key={node.id}
            icon={node.icon}
            label={t(`nodes.${node.id}`)}
            variant={node.variant}
            index={index}
          />
        ))}
      </div>
      <div className="brand-row">
        <div className="brand-chip">
          <BrandMark name="Python" />
        </div>
        <div className="brand-chip">
          <BrandMark name="scikit-learn" />
        </div>
        <div className="brand-chip">
          <BrandMark name="Streamlit" />
        </div>
      </div>
    </div>
  );
}
