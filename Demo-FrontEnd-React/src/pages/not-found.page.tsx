import { Button, Result } from "antd";
import { useNavigate } from "react-router";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.wrap}>
      <Result
        status="404"
        title="404"
        subTitle="Trang bạn tìm không tồn tại hoặc đã bị xoá."
        extra={
          <Button
            type="primary"
            size="large"
            style={styles.btn}
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 560, margin: "0 auto", padding: "48px 24px" },
  btn: { backgroundColor: "#2DC275", borderColor: "#2DC275", borderRadius: 10, fontWeight: 700, height: 48 },
};
