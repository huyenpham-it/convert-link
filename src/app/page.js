"use client";

import { MyButton } from "@/components/MyButton";
import { Copy, Info, Link, Loader, OctagonAlert } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function extractShopeeIds(expandedUrl) {
  try {
    const match =
      expandedUrl.match(/i\.(\d+)\.(\d+)/) || expandedUrl.match(/(\d+)\/(\d+)/);

    if (!match) return null;

    return {
      shopId: match[1],
      itemId: match[2],
    };
  } catch {
    return null;
  }
}

function buildCanonicalShopeeUrl(shopId, itemId) {
  return `https://shopee.vn/opaanlp/${shopId}/${itemId}`;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [expandedUrl, setExpandedUrl] = useState("");
  const [results, setResults] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const affiliateId = "17311150058";
  const subId = "fb-link";

  const expandLink = async () => {
    const inputDomain = ["shopee.vn", "vn.shp.ee"];
    const isShopeeLink =
      input.includes(inputDomain[0]) || input.includes(inputDomain[1]);

    if (!isShopeeLink) {
      setError("Link không hợp lệ");
      setLoading(false);
      return null;
    }

    setError("");

    try {
      const res = await fetch("/api/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: input,
        }),
      });

      const data = await res.json();

      setExpandedUrl(data.expanded);

      return data.expanded;
    } catch {
      setError("Không thể mở rộng link");
      return null;
    }
  };

  async function convertToAffiliateLink() {
    setLoading(true);
    const expandedUrl = await expandLink();
    if (!expandedUrl) return;

    const ids = extractShopeeIds(expandedUrl);
    if (!ids) return;

    const canonicalUrl = buildCanonicalShopeeUrl(ids.shopId, ids.itemId);

    const encoded = encodeURIComponent(canonicalUrl);

    const converted = `https://s.shopee.vn/an_redir?origin_link=${encoded}&share_channel_code=4&affiliate_id=${affiliateId}&sub_id=${subId}`;

    setLoading(false);
    setResults(converted);
    toast.success("Đã chuyển đổi thành công");
  }

  const copy = () => {
    navigator.clipboard.writeText(results);
    toast.success("Đã copy thành công");
  };

  return (
    <div className="w-full max-w-2xl px-4 mx-auto my-10 space-y-6">
      <Toaster />
      <h1 className="text-[#F05D40] text-center text-2xl md:text-3xl font-bold">
        We Love Shopping
      </h1>

      <div className="bg-white space-y-4 p-4 rounded-lg shadow-[0px_0px_10px_0px_#00000026]">
        <h2 className="text-xl font-bold">
          Chuyển đổi link sản phẩm shopee để dùng mã giảm giá facebook
        </h2>

        <div className="w-full flex flex-col gap-3">
          <div className="w-full">
            <input
              className="border w-full h-[50px] p-3 rounded-lg focus:outline-[#F05D40]"
              placeholder="Dán link Shopee của bạn vào đây"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {error && <p className="text-red-500">{error}</p>}
          </div>
          {/* <MyButton
          className="bg-[#F05D40]"
          func={expandLink}
          text="Mở rộng link"
        /> */}
          <MyButton
            className="w-full bg-[#F05D40]"
            func={convertToAffiliateLink}
            text="Tạo Link"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Link className="w-5 h-5" />}
          </MyButton>
        </div>

        {/* {expandedUrl && (
          <div className="p-3 border rounded-lg break-all">{expandedUrl}</div>
        )} */}

        {results.length > 0 && (
          <>
            <div className="p-3 border border-dashed border-2 border-[#F05D40] rounded-lg break-all">
              {results}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <MyButton
                className="col-span-1 bg-[#F05D40]"
                func={copy}
                text="Copy Link"
              >
                <Copy className="w-5 h-5" />
              </MyButton>

              <a href={results} target="_blank" className="col-span-1">
                <MyButton
                  className="w-full bg-[#F05D40]"
                  func={copy}
                  text="Mở Shopee"
                >
                  <Image
                    src="/shopee.svg"
                    alt="shopee"
                    width={20}
                    height={20}
                  />
                </MyButton>
              </a>

              <a
                href="https://www.facebook.com/groups/938875882144787/permalink/968807565818285/"
                target="_blank"
                className="col-span-1 md:col-span-2"
              >
                <MyButton className="w-full bg-[#0B61F1]" text="Mở Facebook">
                  <Image src="/fb.svg" alt="fb" width={26} height={26} />
                </MyButton>
              </a>
            </div>
          </>
        )}

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-2 font-bold">
            <Info className="w-5 h-5 text-[#0B61F1]" />
            Hướng dẫn
          </div>
          <div>
            1. Dán link Shopee của bạn vào ô trống, sau đó bấm <b>Tạo Link</b>.
            <br />
            2. Sau khi đã có link mới, bấm <b>Copy Link</b> để dán vào bất kì
            đâu nếu bạn chưa muốn mua ngay lập tức.
            <br />
            3. Bấm <b>Mở Shopee</b> để mở trang Shopee mua hàng ngay.
            <br />
            4. Bấm <b>Mở Facebook</b> để vào facebook, dán link vào phần comment
            bài viết trong group, sau đó nhấn link để vào Shopee và dùng mã giảm
            giá 22% hoặc 20% cho sản phẩm bạn vừa chuyển đổi.
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 font-bold">
              <OctagonAlert className="w-5 h-5 text-[#F05D40]" />
              Lưu ý
            </div>
            <div className="font-semibold">
              Mã Facebook có thể lọc sản phẩm và lọc acc Shopee (tức là không
              phải sản phẩm nào sau chuyển đổi cũng xài được mã giảm giá).
            </div>
            <Image
              src="/mgg.jpg"
              loading="eager"
              alt="shopee"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
