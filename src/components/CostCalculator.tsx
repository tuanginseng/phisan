import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, ChevronDown, Calculator } from "lucide-react";
import feeData from "@/data/feeData.json";

type FeeEntry = {
  nganh: string;
  cap1: string;
  cap2: string;
  cap3: string;
  phi_standard: string;
  phi_mall: string;
};

const data = feeData as FeeEntry[];

const parsePercent = (s: string): number => {
  const n = parseFloat(s.replace("%", "").replace(",", "."));
  return isNaN(n) ? 0 : n / 100;
};

const formatVND = (n: number) =>
  Math.round(n).toLocaleString("vi-VN") + "đ";

const formatPercent = (n: number) =>
  (n * 100).toFixed(2) + "%";

const CostCalculator = () => {
  const [productName, setProductName] = useState("");
  const [costPrice, setCostPrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [transactionFee, setTransactionFee] = useState<number>(5); // %
  const [commissionFee, setCommissionFee] = useState<number>(0); // %
  const [taxFee, setTaxFee] = useState<number>(1.5); // %
  const [voucherFee, setVoucherFee] = useState<number>(3); // %
  const [infraFee, setInfraFee] = useState<number>(4620);
  const [affRate, setAffRate] = useState<number>(10); // %
  const [adsRate, setAdsRate] = useState<number>(15); // %
  const [holdingRate, setHoldingRate] = useState<number>(0); // %

  const [selectedFeeItem, setSelectedFeeItem] = useState<FeeEntry | null>(null);
  const [feeType, setFeeType] = useState<"standard" | "mall">("standard");
  const [feeSearchOpen, setFeeSearchOpen] = useState(false);
  const [feeSearch, setFeeSearch] = useState("");

  const filteredFeeData = useMemo(() => {
    if (!feeSearch.trim()) return data.slice(0, 50);
    const q = feeSearch.toLowerCase();
    return data
      .filter(
        (d) =>
          d.cap1.toLowerCase().includes(q) ||
          d.cap2.toLowerCase().includes(q) ||
          d.cap3.toLowerCase().includes(q) ||
          d.nganh.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [feeSearch]);

  const handleSelectFee = (item: FeeEntry) => {
    setSelectedFeeItem(item);
    const pct = feeType === "mall" ? item.phi_mall : item.phi_standard;
    setCommissionFee(parsePercent(pct) * 100);
    setFeeSearchOpen(false);
    setFeeSearch("");
  };

  // Calculations
  const sp = sellingPrice || 0;
  const cp = costPrice || 0;

  const transactionAmount = sp * (transactionFee / 100);
  const commissionAmount = sp * (commissionFee / 100);
  const taxAmount = sp * (taxFee / 100);
  const voucherAmount = sp * (voucherFee / 100);

  const holdingAmount = sp * (holdingRate / 100);
  const totalPlatformFee = transactionAmount + commissionAmount + taxAmount + voucherAmount + infraFee;
  const affAmount = sp * (affRate / 100);
  const adsAmount = sp * (adsRate / 100);

  const profitNatural = sp - cp - totalPlatformFee - holdingAmount;
  const profitAff = profitNatural - affAmount;
  const profitAds = profitNatural - adsAmount;
  const profitAffAds = profitNatural - affAmount - adsAmount;

  const profitNaturalPct = sp > 0 ? profitNatural / sp : 0;
  const profitAffPct = sp > 0 ? profitAff / sp : 0;
  const profitAdsPct = sp > 0 ? profitAds / sp : 0;
  const profitAffAdsPct = sp > 0 ? profitAffAds / sp : 0;

  const costRatio = sp > 0 ? cp / sp : 0;

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          Thông tin sản phẩm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tên sản phẩm</Label>
            <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Nhập tên SP..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Giá nhập (VNĐ)</Label>
            <Input type="number" value={costPrice || ""} onChange={(e) => setCostPrice(Number(e.target.value))} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Giá bán (VNĐ)</Label>
            <Input type="number" value={sellingPrice || ""} onChange={(e) => setSellingPrice(Number(e.target.value))} placeholder="0" />
          </div>
        </div>
        {sp > 0 && (
          <div className="text-xs text-muted-foreground">
            Tỷ lệ giá nhập / giá bán: <span className="font-semibold text-foreground">{formatPercent(costRatio)}</span>
          </div>
        )}
      </Card>

      {/* Platform Fees */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Phí nền tảng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Phí giao dịch (%)</Label>
            <Input type="number" step="0.1" value={transactionFee} onChange={(e) => setTransactionFee(Number(e.target.value))} />
            {sp > 0 && <p className="text-xs text-muted-foreground">= {formatVND(transactionAmount)}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Phí Hoa Hồng (%)</Label>
            <div className="flex gap-2">
              <Popover open={feeSearchOpen} onOpenChange={setFeeSearchOpen}>
                <PopoverTrigger asChild>
                  <button className="flex-1 flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent/50 transition-colors text-left min-h-[40px]">
                    {selectedFeeItem ? (
                      <span className="truncate">
                        {selectedFeeItem.cap2 || selectedFeeItem.cap1}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Chọn ngành hàng...</span>
                    )}
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Tìm ngành hàng..."
                      value={feeSearch}
                      onValueChange={setFeeSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {filteredFeeData.map((item, i) => (
                          <CommandItem
                            key={i}
                            value={`${item.nganh}-${item.cap1}-${item.cap2}-${item.cap3}`}
                            onSelect={() => handleSelectFee(item)}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[9px] shrink-0">{item.nganh}</Badge>
                                <span className="text-sm truncate">{item.cap2 || item.cap1}</span>
                              </div>
                              {item.cap3 && (
                                <span className="text-xs text-muted-foreground truncate pl-1">{item.cap3}</span>
                              )}
                            </div>
                            <div className="text-xs text-right shrink-0 space-y-0.5">
                              <div>TC: {item.phi_standard}</div>
                              <div className="text-primary">Mall: {item.phi_mall}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex rounded-md border border-input overflow-hidden shrink-0">
                <button
                  onClick={() => {
                    setFeeType("standard");
                    if (selectedFeeItem) setCommissionFee(parsePercent(selectedFeeItem.phi_standard) * 100);
                  }}
                  className={`px-2.5 py-1 text-xs transition-colors ${feeType === "standard" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent"}`}
                >
                  TC
                </button>
                <button
                  onClick={() => {
                    setFeeType("mall");
                    if (selectedFeeItem) setCommissionFee(parsePercent(selectedFeeItem.phi_mall) * 100);
                  }}
                  className={`px-2.5 py-1 text-xs transition-colors ${feeType === "mall" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent"}`}
                >
                  Mall
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" step="0.1" value={commissionFee} onChange={(e) => setCommissionFee(Number(e.target.value))} className="w-24" />
              <span className="text-xs text-muted-foreground">%</span>
              {sp > 0 && <span className="text-xs text-muted-foreground">= {formatVND(commissionAmount)}</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Thuế (%)</Label>
            <Input type="number" step="0.1" value={taxFee} onChange={(e) => setTaxFee(Number(e.target.value))} />
            {sp > 0 && <p className="text-xs text-muted-foreground">= {formatVND(taxAmount)}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Voucher / Chương trình (%)</Label>
            <Input type="number" step="0.1" value={voucherFee} onChange={(e) => setVoucherFee(Number(e.target.value))} />
            {sp > 0 && <p className="text-xs text-muted-foreground">= {formatVND(voucherAmount)}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Phí hạ tầng + bồi hoàn (VNĐ)</Label>
            <Input type="number" value={infraFee} onChange={(e) => setInfraFee(Number(e.target.value))} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Chi phí TN Holding (VNĐ)</Label>
            <Input type="number" value={holdingCost} onChange={(e) => setHoldingCost(Number(e.target.value))} />
          </div>
        </div>
        {sp > 0 && (
          <div className="pt-2 border-t border-border text-sm">
            Tổng phí nền tảng: <span className="font-bold text-foreground">{formatVND(totalPlatformFee)}</span>
            <span className="text-muted-foreground ml-2">({formatPercent(totalPlatformFee / sp)})</span>
          </div>
        )}
      </Card>

      {/* Channel Costs */}
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-foreground">Chi phí kênh bán</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">AFF / KOC Tiếp thị (%)</Label>
            <Input type="number" step="0.1" value={affRate} onChange={(e) => setAffRate(Number(e.target.value))} />
            {sp > 0 && <p className="text-xs text-muted-foreground">= {formatVND(affAmount)}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">ADS / Quảng cáo (%)</Label>
            <Input type="number" step="0.1" value={adsRate} onChange={(e) => setAdsRate(Number(e.target.value))} />
            {sp > 0 && <p className="text-xs text-muted-foreground">= {formatVND(adsAmount)}</p>}
          </div>
        </div>
      </Card>

      {/* Profit Summary */}
      {sp > 0 && (
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-foreground">Lợi nhuận theo kênh</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <ProfitCard label="Natural (Tự nhiên)" profit={profitNatural} pct={profitNaturalPct} />
            <ProfitCard label="AFF (KOC Tiếp thị)" profit={profitAff} pct={profitAffPct} />
            <ProfitCard label="ADS (Quảng cáo)" profit={profitAds} pct={profitAdsPct} />
            <ProfitCard label="AFF + ADS" profit={profitAffAds} pct={profitAffAdsPct} />
          </div>
        </Card>
      )}
    </div>
  );
};

const ProfitCard = ({ label, profit, pct }: { label: string; profit: number; pct: number }) => (
  <div className={`rounded-lg border p-3 ${profit >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={`text-lg font-bold ${profit >= 0 ? "text-green-700" : "text-red-600"}`}>
      {formatVND(profit)}
    </p>
    <p className={`text-xs ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
      {formatPercent(pct)}
    </p>
  </div>
);

export default CostCalculator;
