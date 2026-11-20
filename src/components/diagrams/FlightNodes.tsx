import { Armchair, CreditCard, Search, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BrandMark } from "../BrandMark";
import { NodeTile } from "./NodeTile";
export function FlightNodes() {
  const { t } = useTranslation();
  return (
    <div className="node-stage">
      <div className="node-row">
        <NodeTile icon={Search} label={t("nodes.search")} index={0} />
        <NodeTile icon={Armchair} label={t("nodes.seatHold")} index={1} />
        <NodeTile
          icon={CreditCard}
          label={t("nodes.checkout")}
          variant="hybrid"
          index={2}
        />
        <NodeTile
          icon={Ticket}
          label={t("nodes.eticket")}
          variant="support"
          index={3}
        />
      </div>
      <div className="brand-row">
        <div className="brand-chip">
          <BrandMark name="React 19" />
        </div>
        <div className="brand-chip">
          <BrandMark name="ASP.NET Core" />
        </div>
        <div className="brand-chip">
          <BrandMark name="SQLite" />
        </div>
      </div>
    </div>
  );
}
