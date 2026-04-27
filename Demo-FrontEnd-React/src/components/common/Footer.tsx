import { Layout, Row, Col, Divider } from "antd";
import {
  FacebookOutlined,
  YoutubeOutlined,
  InstagramOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter style={styles.footer}>
      <div style={styles.inner}>
        <Row gutter={[32, 32]}>
          {/* Brand */}
          <Col xs={24} sm={24} md={8}>
            <div style={styles.brand}>TicketBox</div>
            <p style={styles.tagline}>
              Nền tảng mua bán vé sự kiện hàng đầu Việt Nam.
            </p>
            <div style={styles.socials}>
              <a href="#" style={styles.socialIcon}><FacebookOutlined /></a>
              <a href="#" style={styles.socialIcon}><YoutubeOutlined /></a>
              <a href="#" style={styles.socialIcon}><InstagramOutlined /></a>
            </div>
          </Col>

          {/* Links - Khám phá */}
          <Col xs={12} sm={8} md={4}>
            <div style={styles.colTitle}>Khám phá</div>
            {["Âm nhạc", "Thể thao", "Nghệ thuật", "Hội thảo", "Ẩm thực"].map((item) => (
              <div key={item}>
                <a href="#" style={styles.link}>{item}</a>
              </div>
            ))}
          </Col>

          {/* Links - Hỗ trợ */}
          <Col xs={12} sm={8} md={4}>
            <div style={styles.colTitle}>Hỗ trợ</div>
            {["Trung tâm trợ giúp", "Liên hệ", "Chính sách hoàn vé", "Điều khoản"].map((item) => (
              <div key={item}>
                <a href="#" style={styles.link}>{item}</a>
              </div>
            ))}
          </Col>

          {/* Links - Tổ chức */}
          <Col xs={12} sm={8} md={4}>
            <div style={styles.colTitle}>Tổ chức sự kiện</div>
            {["Tạo sự kiện", "Quản lý sự kiện", "Báo cáo doanh thu"].map((item) => (
              <div key={item}>
                <a href="#" style={styles.link}>{item}</a>
              </div>
            ))}
          </Col>
        </Row>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)", margin: "32px 0 16px" }} />

        <div style={styles.bottom}>
          <span>© 2025 TicketBox. All rights reserved.</span>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    padding: "48px 0 24px",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
  },
  brand: {
    fontWeight: 800,
    fontSize: 22,
    color: "#2DC275",
    marginBottom: 12,
    letterSpacing: "-0.5px",
  },
  tagline: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 16,
  },
  socials: {
    display: "flex",
    gap: 12,
  },
  socialIcon: {
    fontSize: 20,
    color: "rgba(255,255,255,0.6)",
    transition: "color 0.2s",
  },
  colTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: "#fff",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  link: {
    display: "block",
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    marginBottom: 8,
    textDecoration: "none",
    transition: "color 0.2s",
  },
  bottom: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 13,
    textAlign: "center",
  },
};