import { useState, useMemo } from "react";
import feeData from "@/data/feeData.json";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

type FeeEntry = {
  nganh: string;
  cap1: string;
  cap2: string;
  cap3: string;
  phi_standard: string;
  phi_mall: string;
};

const data = feeData as FeeEntry[];

const NGANH_COLORS: Record<string, string> = {
  "Thiết bị điện tử": "bg-blue-100 text-blue-800 border-blue-200",
  "Thời trang": "bg-pink-100 text-pink-800 border-pink-200",
  "Nhà cửa & Đời sống": "bg-green-100 text-green-800 border-green-200",
  "Sức khoẻ & Làm đẹp": "bg-purple-100 text-purple-800 border-purple-200",
  "Mẹ & bé": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Tạp hoá": "bg-orange-100 text-orange-800 border-orange-200",
};

const FeeTable = () => {
  const [search, setSearch] = useState("");
  const [selectedNganh, setSelectedNganh] = useState<string | null>(null);
  const [selectedCap1, setSelectedCap1] = useState<string | null>(null);

  const nganhList = useMemo(() => [...new Set(data.map((d) => d.nganh))].sort(), []);

  const cap1List = useMemo(() => {
    if (!selectedNganh) return [];
    return [...new Set(data.filter((d) => d.nganh === selectedNganh).map((d) => d.cap1))].sort();
  }, [selectedNganh]);

  const filtered = useMemo(() => {
    let result = data;
    if (selectedNganh) result = result.filter((d) => d.nganh === selectedNganh);
    if (selectedCap1) result = result.filter((d) => d.cap1 === selectedCap1);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.cap1.toLowerCase().includes(q) ||
          d.cap2.toLowerCase().includes(q) ||
          d.cap3.toLowerCase().includes(q) ||
          d.nganh.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, selectedNganh, selectedCap1]);

  const clearFilters = () => {
    setSelectedNganh(null);
    setSelectedCap1(null);
    setSearch("");
  };

  const hasFilters = selectedNganh || selectedCap1 || search.trim();

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sản phẩm, ngành hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-background"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {nganhList.map((n) => (
          <button
            key={n}
            onClick={() => {
              setSelectedNganh(selectedNganh === n ? null : n);
              setSelectedCap1(null);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              selectedNganh === n
                ? NGANH_COLORS[n] + " ring-2 ring-primary/30"
                : "border-border bg-card text-muted-foreground hover:bg-secondary"
            }`}
          >
            {n}
          </button>
        ))}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-full border border-destructive/30 px-3 py-1 text-xs text-destructive hover:bg-destructive/10 transition-all"
          >
            <X className="h-3 w-3" /> Xoá bộ lọc
          </button>
        )}
      </div>

      {cap1List.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cap1List.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCap1(selectedCap1 === c ? null : c)}
              className={`rounded-lg border px-2.5 py-0.5 text-xs transition-all ${
                selectedCap1 === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>{filtered.length.toLocaleString()} kết quả</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Ngành</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Nhóm cấp 1</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Nhóm cấp 2</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Nhóm cấp 3</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground whitespace-nowrap">Phí Tiêu chuẩn</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground whitespace-nowrap">Phí Mall</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 200).map((item, i) => (
              <tr key={i} className="border-b border-border/50 transition-colors hover:bg-accent/50">
                <td className="px-4 py-2.5">
                  <Badge variant="outline" className={`text-[10px] ${NGANH_COLORS[item.nganh] || ""}`}>
                    {item.nganh}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 text-foreground">{item.cap1}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{item.cap2}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{item.cap3 || "—"}</td>
                <td className="px-4 py-2.5 text-center font-semibold text-foreground">{item.phi_standard}</td>
                <td className="px-4 py-2.5 text-center font-semibold text-primary">{item.phi_mall}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 200 && (
          <div className="border-t border-border bg-secondary/30 px-4 py-3 text-center text-sm text-muted-foreground">
            Đang hiển thị 200 / {filtered.length} kết quả. Hãy dùng bộ lọc để thu hẹp phạm vi.
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-muted-foreground">Không tìm thấy kết quả phù hợp.</div>
        )}
      </div>
    </div>
  );
};

export default FeeTable;
