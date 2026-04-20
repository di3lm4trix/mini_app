import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import useTranslations from "../hooks/useTranslations";

const ProductRow = ({ product, translations }) => {
  const { t, translationsLoading } = useTranslations();

  const [fields, setFields] = useState({
    name_key: product.name_key,
    buy_price: product.buy_price,
    sell_price: product.sell_price,
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field) => (e) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
    setStatus("idle");
  };

  const handleSave = async () => {
    setStatus("saving");
    setErrorMsg("");
    try {
      await apiClient.put(`/api/products/${product.id}`, {
        name_key: fields.name_key,
        buy_price: Number(fields.buy_price) || 0,
        sell_price: Number(fields.sell_price) || 0,
      });
      setStatus("saved");
    } catch (error) {
      setStatus("error");
      console.log(error);
      setErrorMsg(error.response?.data?.message || error.message);
    }
  };

  const isDirty = fields.name_key !== product.name_key;
  Number(fields.buy_price) !== Number(product.buy_price) ||
    Number(fields.sell_price) !== Number(product.sell_price);
  useEffect(() => {
    if (status !== "saved") return;
    const id = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(id);
  }, [status]);

  return (
    <tr
      className={
        status === "saving" ? "is-saving" : status === "saved" ? "is-saved" : ""
      }
    >
      <td className="td-arrow">⭢</td>

      <td className="col-article">
        <input
          type="text"
          value={`${String(product.id).padStart(10, "0")}`}
          readOnly
          style={{ background: "#f9f9f9", color: "#888", cursor: "default" }}
        />
      </td>

      {/* product/service */}
      <td className="td-product">
        <input
          type="text"
          // value={t(translations?.[product.name_key] ?? product.name_key)}
          value={fields.name_key}
          onChange={handleChange("name_key")}
          style={{ background: "#f9f9f9", cursor: "text" }}
          className="pl-input-editable"
        />
      </td>

      <td className="col-inprice">
        <input
          type="number"
          value={fields.buy_price}
          onChange={handleChange("buy_price")}
          min="0"
          step="0.01"
        />
      </td>

      <td className="td-price">
        <input
          type="number"
          value={fields.sell_price}
          onChange={handleChange("sell_price")}
          min="0"
          step="0.01"
        />
      </td>

      <td className="col-unit">
        <input
          type="text"
          value="pcs"
          readOnly
          style={{
            background: "#f9f9f9",
            color: "#888",
            cursor: "default",
            maxWidth: 90,
          }}
        />
      </td>

      <td className="col-instock">
        <input
          type="number"
          value="0"
          readOnly
          style={{
            background: "#f9f9f9",
            color: "#888",
            cursor: "default",
            maxWidth: 90,
          }}
        />
      </td>
      <td className="col-desc">
        <input
          type="text"
          value="-"
          readOnly
          style={{ background: "#f9f9f9", color: "#888", cursor: "default" }}
        />
      </td>

      <td style={{ whiteSpace: "nowrap" }}>
        {isDirty && (
          <button
            className="btn-save-row"
            onClick={handleSave}
            disabled={status === "saving"}
          >
            {status === "saving" ? "..." : t("btn_save")}
          </button>
        )}
        {status === "saved" && (
          <span style={{ color: "#4caf50", fontSize: 13 }}>✓</span>
        )}
        {status === "error" && (
          <span style={{ color: "#e53224", fontSize: 12 }} title={errorMsg}>
            ✗
          </span>
        )}
      </td>
      {/* menu */}
      <td>
        <button className="btn-dots" title="Options">
          ...
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;
