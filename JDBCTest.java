import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class JDBCTest {
    public static void main(String[] args) {
        String url = "jdbc:mysql://shortline.proxy.rlwy.net:29418/railway?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String pass = "fMmOKIERmRDOioYxGhdnibivQcwOnGuo";
        try {
            System.out.println("Attempting connection...");
            Connection conn = DriverManager.getConnection(url, user, pass);
            System.out.println("Connection SUCCESS!");
            conn.close();
        } catch (SQLException e) {
            System.out.println("Connection FAILED!");
            e.printStackTrace();
        }
    }
}
