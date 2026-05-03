import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class JDBCTest3 {
    public static void main(String[] args) {
        String url = "jdbc:mysql://shortline.proxy.rlwy.net:29418/railway?useSSL=true&requireSSL=true";
        String user = "root";
        String pass = "fMmOKIERmRDOioYxGhdnibivQcwOnGuo";
        try {
            System.out.println("Attempting connection with useSSL=true...");
            Connection conn = DriverManager.getConnection(url, user, pass);
            System.out.println("Connection SUCCESS!");
            conn.close();
        } catch (SQLException e) {
            System.out.println("Connection FAILED!");
            e.printStackTrace();
        }
    }
}
