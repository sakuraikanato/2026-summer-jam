import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 開発中、localhost 以外（スマホ実機など LAN 内の別端末）から dev サーバーを開くと
   * /_next/* の取得が 403 で弾かれ、ハイドレートされず操作を受け付けなくなる。
   * ローカルネットワークからのアクセスを許可する。開発時のみ効く設定。
   */
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*"],
};

export default nextConfig;
