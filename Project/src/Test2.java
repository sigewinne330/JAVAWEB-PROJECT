
// 导入必需的 java 库
import org.json.JSONObject;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.MultipartConfig;
import java.lang.*;
import java.io.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.text.*;
import java.util.Queue;

@MultipartConfig
public class Test2 extends HttpServlet {

    // JDBC 驱动名及数据库 URL(URL设置为所在服务器/主机的本地IP，用链路本地地址会导致访问失败)
    static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    static final String DB_URL = "jdbc:mysql://172.23.229.76:3306?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

    // 数据库的用户名与密码
    static final String USER = "root";
    static final String PASS = "Ace3614";

    static Connection conn = null;
    static Statement stmt = null;

    public void init() throws ServletException {
        // 执行必需的初始化
        try {
            // 注册 JDBC 驱动
            Class.forName(JDBC_DRIVER);

            // 打开链接
            System.out.println("连接数据库...");
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            System.out.println("数据库已连接");

            // 调整到查询状态
            System.out.println(" 实例化Statement对象...");
            stmt = conn.createStatement();
            stmt.execute("USE SHOP");
            System.out.println("数据库初始化完成");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }

    public void doPost(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException {
        // 设置响应内容类型
        response.setContentType("text/html;charset=utf-8");
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        // 读取表单类型
        String formtype = request.getParameter("formtype");
        // 获取当前请求的URL
        String referer = request.getHeader("referer");
        // 获取当前请求的 Session 对象
        HttpSession session = request.getSession();
        //设置图片存储路径
        String savePath = "/opt/apache-tomcat-9.0.97/webapps/Project/Image";

        if( formtype == null ){
            formtype="default";
        }

        if(formtype.equals("login")) //响应类型1：用户登录
        {
            //读取账号密码
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            // 向 Session 中存储用户属性
            session.setAttribute("username", username);
            session.setAttribute("password", password);

            //查询账号
            try {
                PreparedStatement stm = conn.prepareStatement("SELECT * FROM USERS WHERE USERNAME=?;");
                stm.setString(1, username);
                ResultSet rs = stm.executeQuery();
                PrintWriter out = response.getWriter();

                if (!rs.next()) {
                    if (referer!= null) {
                        // 用户名不存在
                        out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'errtype = username_not_exist; expires =' + date.toUTCString(); history.back();</script>");
                        if (session!= null)
                            session.invalidate();
                    } else {
                        // 处理无法获取原网页 URL 的情况
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "无法获取原网页 URL");
                    }
                }
                else {
                    String correctpassword = rs.getString("PASSWORD");
                    if (password.equals(correctpassword)) {
                        int usertype = rs.getInt("USERTYPE");
                        String userid = rs.getString("ID");
                        session.setAttribute("userid", userid);
                        switch(usertype)
                        {
                            case 1:response.sendRedirect("BIndex.HTML");break;
                            case 2:response.sendRedirect("CIndex.html");break;
                        }

                    } else {
                        if (referer!= null) {
                            // 密码错误的处理
                            out.write("<script > let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'errtype = password_incorrect; expires =' + date.toUTCString(); history.back();</script>");
                            if (session!= null)
                                session.invalidate();
                        } else {
                            // 处理无法获取原网页 URL 的情况
                            response.sendError(HttpServletResponse.SC_NOT_FOUND, "无法获取原网页 URL");
                        }
                    }
                }
                rs.close();
                stm.close();
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        else if(formtype.equals("register")) //响应类型2：新用户注册
        {

            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String usertype = request.getParameter("usertype");

            PrintWriter out = response.getWriter();

            try {
                PreparedStatement stm = conn.prepareStatement("SELECT * FROM USERS WHERE USERNAME=?;");
                stm.setString(1, username);
                ResultSet rs = stm.executeQuery();

                if (rs.next())
                {
                    out.write("<script>let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'errtype = username_is_exist; expires =' + date.toUTCString(); history.back();</script>");
                    if(session!= null)
                        session.invalidate();
                }
                else
                {
                    stm = conn.prepareStatement("SELECT * FROM COUNTS WHERE TNO = ?;");
                    stm.setString(1, usertype);
                    rs = stm.executeQuery();

                    String str="";
                    if(rs.next())
                    {
                        char pre=rs.getString("TNAME").toUpperCase().charAt(0);
                        int no=rs.getInt("TSIZE")+1;
                        str = String.valueOf(no);
                        StringBuilder sb = new StringBuilder();
                        for (int i = str.length(); i < 9; i++) {
                            sb.append('0');
                        }
                        sb.append(str);
                        str=pre + sb.toString();
                    }

                    stm = conn.prepareStatement("INSERT INTO USERS VALUES (?,?,?,?);");
                    stm.setString(1, str);
                    stm.setString(2, username);
                    stm.setString(3, password);
                    stm.setString(4, usertype);
                    stm.execute();
                    out.write("<script>let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'status =  succeed; expires =' + date.toUTCString(); history.back();</script>");
                    if(session!= null)
                        session.invalidate();
                }
                rs.close();
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("forget")) //响应类型3：忘记密码或者修改密码
        {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            try {
                PreparedStatement stm = conn.prepareStatement("SELECT * FROM USERS WHERE USERNAME=?;");
                stm.setString(1, username);
                ResultSet rs = stm.executeQuery();
                PrintWriter out = response.getWriter();

                if (!rs.next()) {
                    if (referer!= null) {
                        // 用户名不存在
                        out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'errtype = username_not_exist; expires =' + date.toUTCString(); history.back();</script>");
                        if (session!= null)
                            session.invalidate();
                    } else {
                        // 处理无法获取原网页 URL 的情况
                        response.sendError(HttpServletResponse.SC_NOT_FOUND, "无法获取原网页 URL");
                    }
                }
                else {
                    stm= conn.prepareStatement("UPDATE USERS SET PASSWORD = ? WHERE USERNAME = ?;");
                    stm.setString(1, password);
                    stm.setString(2,username);
                    stm.execute();
                    session.setAttribute("password", password);
                    out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'result = succeed; expires =' + date.toUTCString(); history.back();</script>");
                }
                rs.close();
                stm.close();
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("userinfo")) //响应类型4：查看用户信息
        {
            Writer out = response.getWriter();
            String username = session.getAttribute("username").toString();
            String password = session.getAttribute("password").toString();
            String userid = session.getAttribute("userid").toString();
            out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'info = " + username + "&" + password + "&" + userid + "; expires =' + date.toUTCString(); window.location.href = 'Info.html';</script>");
        }
        else if(formtype.equals("modify_username")) //响应类型5：修改用户名
        {
            String username = request.getParameter("username");
            Writer out = response.getWriter();
            try{
            PreparedStatement stm = conn.prepareStatement("SELECT * FROM USERS WHERE USERNAME=?;");
            stm.setString(1, username);
            ResultSet rs = stm.executeQuery();
            //检查是否有重名的用户
            if (rs.next()) {
                out.write("<script>let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'errtype = username_is_exist; expires =' + date.toUTCString(); history.back();</script>");
            }
            else
            {
                stm = conn.prepareStatement("UPDATE USERS SET USERNAME=? WHERE ID=?;");
                stm.setString(1, username);
                stm.setString(2, session.getAttribute("userid").toString());
                stm.execute();
                session.setAttribute("username", username);
                out.write("<script>let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'status = succeed; expires =' + date.toUTCString(); history.back();</script>");
            }
            rs.close();
            stm.close();
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }
        else if (formtype.equals("modify_password")) //响应类型6：修改密码（跳到类型3）
        {
            Writer out = response.getWriter();
            String username = session.getAttribute("username").toString();
            out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'info = " + username + "; expires =' + date.toUTCString(); window.location.href = 'Forget.html';</script>");
        }
        else if(formtype.equals("cindex_list")) //响应类型7：显示顾客的主页（商品展示信息）
        {
            Writer out = response.getWriter();
            List<JSONObject> list = new ArrayList<JSONObject>();
            try {
                String sql = "select * from GOODS WHERE GSTATUS = 1;";
                PreparedStatement stm = conn.prepareStatement(sql);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("id", rs.getString("GID"));
                    json.put("name", rs.getString("GNAME"));
                    json.put("price", rs.getString("GPRICE"));
                    json.put("quantity", rs.getInt("GNUM"));
                    json.put("provider", rs.getString("GPROVIDER"));
                    json.put("image", rs.getString("GIMAGE"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("getdetails")) //响应类型8：显示商品的信息
        {
            String goodid = request.getParameter("goodid");
            String userid = session.getAttribute("userid").toString();
            Writer out = response.getWriter();
            String text = "";
            try {
                PreparedStatement stm0 = conn.prepareStatement("INSERT INTO BLOG VALUES(?,?,0,CURRENT_TIMESTAMP);");
                stm0.setString(1, userid);
                stm0.setString(2, goodid);
                stm0.execute();
                stm0.close();

                PreparedStatement stm = conn.prepareStatement("SELECT GNAME,GPRICE,GNUM,USERNAME,GIMAGE FROM GOODS , USERS WHERE GOODS.GID = ? AND USERS.ID = GOODS.GPROVIDER;");
                stm.setString(1, goodid);
                ResultSet rs = stm.executeQuery();
                if (rs.next()) {
                    String goodname = rs.getString("GNAME");
                    String goodprice = rs.getString("GPRICE");
                    String goodquantity = rs.getString("GNUM");
                    String goodimage = rs.getString("GIMAGE");
                    String goodprovider = rs.getString("USERNAME");
                    if(goodimage == null)
                        goodimage = "./Image/default.jpg";
                    text += goodname + "&" + goodprice + "&" + goodquantity + "&" + goodimage + "&" + goodprovider + "&" + goodid + "&";
                    PreparedStatement stm2 = conn.prepareStatement("SELECT CGNUM FROM CART WHERE CGID = ? AND CUSERID = ?;");
                    stm2.setString(1, goodid);
                    stm2.setString(2, userid);
                    ResultSet rs2 = stm2.executeQuery();
                    if (rs2.next()) {
                        String cnum = rs2.getString("CGNUM");
                        text += cnum;
                    }
                    else
                    {
                        text += "0";
                    }
                    out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'info = " + text + "; expires =' + date.toUTCString(); window.location.href = 'Detail.html';</script>");
                    rs2.close();
                    stm2.close();
                }
                rs.close();
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("searchgoods"))//响应类型9：搜索商品
        {
            String text = request.getParameter("text");
            String searchtext = "'%";
            for(int i=0;i<text.length();++i)
            {
                searchtext = searchtext + text.charAt(i) + "%";
            }
            searchtext += "'";
            Writer out = response.getWriter();
            List<JSONObject> list = new ArrayList<JSONObject>();
            try {
                String sql = "select * from GOODS WHERE GNAME LIKE " + searchtext + ";";
                PreparedStatement stm = conn.prepareStatement(sql);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("id", rs.getString("GID"));
                    json.put("name", rs.getString("GNAME"));
                    json.put("price", rs.getString("GPRICE"));
                    json.put("quantity", rs.getInt("GNUM"));
                    json.put("provider", rs.getString("GPROVIDER"));
                    json.put("image", rs.getString("GIMAGE"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("buy")) //响应类型10：把商品加入到购物车
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String goodid = request.getParameter("goodid");
            String goodprice = request.getParameter("goodprice");
            Integer goodnum = Integer.parseInt(request.getParameter("quantity"));
            try{
                    PreparedStatement stm = conn.prepareStatement("SELECT * FROM CART WHERE CGID = ? AND CUSERID = ?;");
                    stm.setString(1,goodid);
                    stm.setString(2,userid);
                    ResultSet rs = stm.executeQuery();
                    if (rs.next()) {
                        PreparedStatement update = conn.prepareStatement("UPDATE CART SET CGNUM = ? , CGPRICE = ?, CTIME = CURRENT_TIMESTAMP WHERE CGID = ? AND CUSERID = ?;");
                        update.setInt(1, goodnum);
                        update.setString(2, goodprice);
                        update.setString(3, goodid);
                        update.setString(4, userid);
                        update.execute();
                        out.write("<script>history.back();</script>");
                        update.close();
                    }
                    else
                    {
                        PreparedStatement buy = conn.prepareStatement("INSERT INTO CART VALUES(?,?,?,?,CURRENT_TIMESTAMP,?);");
                        buy.setString(1, String.valueOf(System.currentTimeMillis()));
                        buy.setString(2, goodid);
                        buy.setInt(3, goodnum);
                        buy.setString(4, userid);
                        buy.setString(5, goodprice);
                        buy.execute();
                        out.write("<script>history.back();</script>");
                        buy.close();
                    }
                    rs.close();
                    stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("cartinfo")) //响应类型11：查看购物车
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            List<JSONObject> list = new ArrayList<JSONObject>();
            try {
                PreparedStatement reload = conn.prepareStatement("DELETE FROM CART WHERE CTIME < DATE_SUB(NOW(), INTERVAL 1 HOUR) OR CGID IN (SELECT GID FROM GOODS WHERE GSTATUS = 0);");
                reload.execute();
                reload.close();

                PreparedStatement stm = conn.prepareStatement("SELECT GOODS.GID, GOODS.GNAME,CART.CGNUM, CART.CGPRICE AS PRICE, CART.CTIME FROM GOODS,CART WHERE GOODS.GID = CART.CGID AND CART.CUSERID = ?;");
                stm.setString(1, userid);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("id", rs.getString("GID"));
                    json.put("name", rs.getString("GNAME"));
                    json.put("price", rs.getString("PRICE"));
                    json.put("quantity", rs.getString("CGNUM"));
                    json.put("timestamp", rs.getString("CTIME"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if (formtype.equals("rmcart")) //响应类型12：删除购物车的商品
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String goodid = request.getParameter("rmgoodid");
            try
            {
                PreparedStatement stm = conn.prepareStatement("DELETE FROM CART WHERE CUSERID = ? AND CGID = ?;");
                stm.setString(1,userid);
                stm.setString(2,goodid);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch(Exception e)
            {
                e.printStackTrace();
            }

        }
        else if (formtype.equals("rmcartall")) //响应类型13：清空购物车
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            try
            {
                PreparedStatement stm = conn.prepareStatement("DELETE FROM CART WHERE CUSERID = ?;");
                stm.setString(1,userid);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch(Exception e)
            {
                e.printStackTrace();
            }

        }
        else if (formtype.equals("pay")) //响应类型14：支付
        {//把购物车表的商品移动到订单表
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            Queue<String> cid = new LinkedList<>();
            Queue<String> cgid = new LinkedList<>();
            Queue<Integer> cgnum = new LinkedList<>();
            Queue<String> cuserid = new LinkedList<>();
            Queue<String> ctime = new LinkedList<>();
            Queue<String> cgprice = new LinkedList<>();
            try{
                PreparedStatement stm = conn.prepareStatement("SELECT * FROM CART WHERE CUSERID = ?;");
                stm.setString(1,userid);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    cid.offer(rs.getString("CID"));
                    cgid.offer(rs.getString("CGID"));
                    cgnum.offer(rs.getInt("CGNUM"));
                    cuserid.offer(rs.getString("CUSERID"));
                    ctime.offer(rs.getString("CTIME"));
                    cgprice.offer(rs.getString("CGPRICE"));
                }
                rs.close();
                stm.close();

                PreparedStatement delstm = conn.prepareStatement("DELETE FROM CART WHERE CUSERID = ?;");
                delstm.setString(1,userid);
                delstm.execute();
                delstm.close();

                while(!cid.isEmpty())
                {
                    PreparedStatement stm0 = conn.prepareStatement("INSERT INTO BLOG VALUES(?,?,1,CURRENT_TIMESTAMP);");
                    stm0.setString(1,userid);
                    stm0.setString(2,cgid.peek());
                    stm0.execute();
                    stm0.close();

                    PreparedStatement paystm = conn.prepareStatement("INSERT INTO ORDERS VALUES(?,?,?,?,?,CURRENT_TIMESTAMP,NULL,NULL,?,?);");
                    paystm.setString(1, cid.poll());
                    paystm.setString(2, cgid.peek());
                    paystm.setInt(3, cgnum.peek());
                    paystm.setString(4, cuserid.poll());
                    paystm.setString(5, ctime.poll());
                    paystm.setString(6, "已支付");
                    paystm.setString(7,cgprice.poll());
                    paystm.execute();
                    paystm.close();

                    PreparedStatement minusstm = conn.prepareStatement("UPDATE GOODS SET GNUM = GNUM - ? WHERE GID = ?;");
                    minusstm.setInt(1, cgnum.poll());
                    minusstm.setString(2, cgid.poll());
                    minusstm.execute();
                    minusstm.close();

                    PreparedStatement checkstm = conn.prepareStatement("UPDATE GOODS SET GSTATUS = 0 WHERE GNUM <= 0;");
                    checkstm.execute();
                    checkstm.close();
                }
                out.write("<script>history.back();</script>");
            }
            catch(Exception e)
            {
                e.printStackTrace();
            }
        }
        else if (formtype.equals("orderinfo")) //响应类型15：查看已支付的订单信息
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            List<JSONObject> list = new ArrayList<JSONObject>();
            try {
                PreparedStatement stm = conn.prepareStatement("SELECT ORDERS.CID, GOODS.GNAME,ORDERS.CGNUM, ORDERS.CGPRICE AS PRICE, ORDERS.PAYTIME, ORDERS.STATUS FROM GOODS,(SELECT * FROM ORDERS WHERE ORDERS.CUSERID = ? AND STATUS !='已收货') AS ORDERS WHERE GOODS.GID = ORDERS.CGID \n;");
                stm.setString(1, userid);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("id", rs.getString("CID"));
                    json.put("name", rs.getString("GNAME"));
                    json.put("price", rs.getString("PRICE"));
                    json.put("quantity", rs.getString("CGNUM"));
                    json.put("timestamp", rs.getString("PAYTIME"));
                    json.put("status", rs.getString("STATUS"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("receive")) //响应类型16：确认收货
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String orderid = request.getParameter("orderid");
            try{
                PreparedStatement stm0 = conn.prepareStatement("UPDATE ORDERS SET STATUS = ?,RECETIME = CURRENT_TIMESTAMP WHERE CID = ?;");
                stm0.setString(1,"已收货");
                stm0.setString(2,orderid);
                stm0.execute();
                stm0.close();

                PreparedStatement stm = conn.prepareStatement("SELECT * FROM ORDERS WHERE CID = ?;");
                stm.setString(1, orderid);
                ResultSet rs = stm.executeQuery();
                String cid = "",cgid = "",carttime = "",paytime = "",recetime = "",cgprice="";
                int cgnum = 0;
                while (rs.next()) {
                    cid = rs.getString("CID");
                    cgid = rs.getString("CGID");
                    cgnum = rs.getInt("CGNUM");
                    carttime = rs.getString("CARTTIME");
                    paytime = rs.getString("PAYTIME");
                    recetime = rs.getString("RECETIME");
                    cgprice = rs.getString("CGPRICE");
                }
                rs.close();
                stm.close();

                PreparedStatement stm1 = conn.prepareStatement("INSERT INTO CLOG VALUES(?,?,?,?,?,?,?,?);");
                stm1.setString(1,cid);
                stm1.setString(2,cgid);
                stm1.setInt(3,cgnum);
                stm1.setString(4,userid);
                stm1.setString(5,carttime);
                stm1.setString(6,paytime);
                stm1.setString(7,recetime);
                stm1.setString(8,cgprice);
                stm1.execute();
                out.write("<script>history.back();</script>");
                stm1.close();
            }
            catch(Exception e)
            {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("cartloginfo")) //响应类型17：查看历史记录
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            List<JSONObject> list = new ArrayList<JSONObject>();
            try {
                PreparedStatement reload = conn.prepareStatement("DELETE FROM CART WHERE CTIME < DATE_SUB(NOW(), INTERVAL 1 HOUR);");
                reload.execute();
                reload.close();
                PreparedStatement stm = conn.prepareStatement("SELECT CLOG.CID, GOODS.GNAME, CLOG.CARTTIME,CLOG.PAYTIME,CLOG.RECETIME, CLOG.CGNUM, CLOG.CGPRICE AS PRICE FROM GOODS,CLOG WHERE GOODS.GID = CLOG.CGID AND CLOG.CUSERID = ?;");
                stm.setString(1, userid);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("id", rs.getString("CID"));
                    json.put("name", rs.getString("GNAME"));
                    json.put("price", rs.getString("PRICE"));
                    json.put("quantity", rs.getString("CGNUM"));
                    json.put("carttime", rs.getString("CARTTIME"));
                    json.put("paytime", rs.getString("PAYTIME"));
                    json.put("recetime", rs.getString("RECETIME"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("delcartlog")) //响应类型18：删除历史记录
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            try
            {
                PreparedStatement stm = conn.prepareStatement("DELETE FROM CLOG WHERE CUSERID = ?;");
                stm.setString(1,userid);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch(Exception e)
            {
                e.printStackTrace();
            }
        }
        else if (formtype.equals("bindex_man")) //响应类型19：商品管理查询
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String gno = request.getParameter("gno");
            String gname = request.getParameter("gname");
            Integer status = Integer.parseInt(request.getParameter("goodstatus"));
            List<JSONObject> list = new ArrayList<JSONObject>();
            gno = (gno =="")? "%":modifyString(gno);
            gname = (gname =="")? "%":modifyString(gname);
            try
            {
                PreparedStatement stm;
                if(status == 2)
                {
                    stm = conn.prepareStatement("SELECT * FROM GOODS WHERE GPROVIDER = ? AND GID LIKE ? AND GNAME LIKE ? ORDER BY GSTATUS DESC;");
                    stm.setString(1, userid);
                    stm.setString(2, gno);
                    stm.setString(3, gname);
                }
                else
                {
                    stm = conn.prepareStatement("SELECT * FROM GOODS WHERE GPROVIDER = ? AND GID LIKE ? AND GNAME LIKE ? AND GSTATUS = ?;");
                    stm.setString(1, userid);
                    stm.setString(2, gno);
                    stm.setString(3, gname);
                    stm.setInt(4, status);
                }
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("goodid", rs.getString("GID"));
                    json.put("goodname", rs.getString("GNAME"));
                    json.put("goodprice", rs.getString("GPRICE"));
                    json.put("goodquantity", rs.getInt("GNUM"));
                    json.put("goodstatus", rs.getInt("GSTATUS"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }

        }
        else if(formtype.equals("newgood")) //响应类型20：商户添加新商品
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String gnum = request.getParameter("gnum");
            String gname = request.getParameter("gname");
            String gprice = request.getParameter("gprice");
            String gid = "";
            try{
                PreparedStatement stm = conn.prepareStatement("SELECT MAX(GID) FROM GOODS;");
                ResultSet rs = stm.executeQuery();
                if (rs.next()) {
                    String maxid = rs.getString("MAX(GID)");
                    Integer size = Integer.parseInt(maxid)+1;
                    String sizeno = size.toString();
                    int mendzero = 12-sizeno.length();
                    for(int i=0;i<mendzero;++i)
                    {
                        gid += "0";
                    }
                    gid += sizeno;
                }
                rs.close();
                stm.close();
            }
            catch(Exception e){
                e.printStackTrace();
            }
            //保存图片
            String img;
            Part filePart = request.getPart("gimage");
            if(filePart != null)
            {
                String fileName = filePart.getSubmittedFileName();
                long fileSize = filePart.getSize();
                if(fileSize > 0) {
                    File fileSaveDir = new File(savePath);
                    if (!fileSaveDir.exists()) {
                        fileSaveDir.mkdirs();
                    }
                    String type = getFileType(fileName);
                    filePart.write(savePath + File.separator + gid + type);
                    img = "./Image/" + gid + type;
                }
                else
                    img = null;
            }
            else
                img = null;
            try{
                PreparedStatement stm = conn.prepareStatement("INSERT INTO GOODS VALUES(?,?,?,?,?,?,0);");
                stm.setString(1, gid);
                stm.setString(2, gname);
                stm.setString(3, gprice);
                stm.setString(4, gnum);
                stm.setString(5, userid);
                stm.setString(6, img);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch(Exception e){
                e.printStackTrace();
            }
        }
        else if(formtype.equals("countgood")) //响应类型21：统计商户商品
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            try{
                PreparedStatement stm = conn.prepareStatement("SELECT  COUNT(*),SUM(GNUM),SUM(GPRICE*GNUM) FROM GOODS WHERE GPROVIDER = ? AND GSTATUS = 1;");
                stm.setString(1, userid);
                ResultSet rs = stm.executeQuery();
                DecimalFormat df = new DecimalFormat("#.00");
                if (rs.next()) {
                    Integer classsum = rs.getInt("COUNT(*)");
                    String valuesum = df.format(rs.getDouble("SUM(GPRICE*GNUM)"));
                    Integer numsum = rs.getInt("SUM(GNUM)");
                    String info = classsum.toString()+"&"+valuesum+"&"+numsum.toString();
                    out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 'info = " + info + "; expires =' + date.toUTCString(); history.back();</script>");
                }
                rs.close();
                stm.close();
            }
            catch(Exception e){
                e.printStackTrace();
            }
        }
        else if(formtype.equals("addgoodnum")) //响应类型22：添加某一件商品(数量)
        {
            Writer out = response.getWriter();
            String gname = request.getParameter("addgname");
            String gnum = request.getParameter("addgnum");
            try {
                PreparedStatement stm = conn.prepareStatement("UPDATE GOODS SET GNUM = GNUM + ? WHERE GNAME = ?");
                stm.setString(1, gnum);
                stm.setString(2, gname);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }

        }
        else if(formtype.equals("modgoodnum")) //响应类型23：修改商品信息
        {
            Writer out = response.getWriter();
            String gname = request.getParameter("modgname");
            String gprice = request.getParameter("modgprice");
            String gid = request.getParameter("modgoodid");
            String img = null;
            try {
                PreparedStatement stm0 = conn.prepareStatement("SELECT GIMAGE FROM GOODS WHERE GID = ?");
                stm0.setString(1, gid);
                ResultSet rs0 = stm0.executeQuery();
                if (rs0.next())
                {
                    img = rs0.getString("GIMAGE");
                }
                rs0.close();
                stm0.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            //保存图片
            Part filePart = request.getPart("modgimage");
            if(filePart != null) {
                String fileName = filePart.getSubmittedFileName();
                long fileSize = filePart.getSize();
                if(fileSize > 0) {
                    File fileSaveDir = new File(savePath);
                    if (!fileSaveDir.exists()) {
                        fileSaveDir.mkdirs();
                    }
                    String type = getFileType(fileName);
                    filePart.write(savePath + File.separator + gid + type);
                    img = "./Image/" + gid + type;
                }
            }
            //将价格转换为浮点数
            Double price = Double.valueOf(gprice);
            try {
                PreparedStatement stm = conn.prepareStatement("UPDATE GOODS SET GPRICE = ? , GNAME = ?,GIMAGE = ? WHERE GID = ?");
                stm.setDouble(1, price);
                stm.setString(2, gname);
                stm.setString(3, img);
                stm.setString(4, gid);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch (Exception e) {
                e.printStackTrace();
            }

        }
        else if(formtype.equals("delgoodnum")) //响应类型24：将某一件商品上架/下架
        {
            Writer out = response.getWriter();
            String gid = request.getParameter("delgid");
            Integer gstatus = Integer.parseInt(request.getParameter("gstatus"));
            gstatus = gstatus==1?0:1;
            try{
                PreparedStatement stm = conn.prepareStatement("UPDATE GOODS SET GSTATUS = ? WHERE GID = ?");
                stm.setInt(1, gstatus);
                stm.setString(2, gid);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch(Exception e){
                e.printStackTrace();
            }
        }
        else if(formtype.equals("bindex_order")) //响应类型25：查询订单列表
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String custno = request.getParameter("userid");
            String cid = request.getParameter("cid");
            String gno = request.getParameter("gno");
            String from = request.getParameter("from");
            String to = request.getParameter("to");
            String orderstatus = request.getParameter("orderstatus");
            List<JSONObject> list = new ArrayList<JSONObject>();
            custno = (custno == "") ? "%" : modifyString(custno);
            cid = (cid == "") ? "%" : modifyString(cid);
            gno = (gno =="")? "%":modifyString(gno);
            try
            {
                PreparedStatement stm;
                if(orderstatus.equals("全部"))
                {
                    stm = conn.prepareStatement("SELECT CID,GID,CGNUM,( CGNUM * GPRICE )AS PRICE,CUSERID,STATUS FROM (SELECT * FROM GOODS WHERE GPROVIDER = ? AND GID LIKE ? ) AS GOODS,ORDERS WHERE GOODS.GID = ORDERS.CGID AND CID LIKE ? AND CUSERID LIKE ? AND PAYTIME BETWEEN ? AND ? ORDER BY STATUS ASC,PAYTIME ASC;");
                    stm.setString(1, userid);
                    stm.setString(2, gno);
                    stm.setString(3,cid);
                    stm.setString(4, custno);
                    stm.setString(5, from);
                    stm.setString(6, to);
                }
                else
                {
                    stm = conn.prepareStatement("SELECT CID,GID,CGNUM,( CGNUM * GPRICE )AS PRICE,CUSERID,STATUS FROM (SELECT * FROM GOODS WHERE GPROVIDER = ? AND GID LIKE ? ) AS GOODS,ORDERS WHERE GOODS.GID = ORDERS.CGID AND CID LIKE ? AND CUSERID LIKE ? AND STATUS = ? AND PAYTIME BETWEEN ? AND ? ORDER BY PAYTIME ASC;");
                    stm.setString(1, userid);
                    stm.setString(2, gno);
                    stm.setString(3,cid);
                    stm.setString(4, custno);
                    stm.setString(5,orderstatus);
                    stm.setString(6, from);
                    stm.setString(7, to);
                }

                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("cid", rs.getString("CID"));
                    json.put("gname", rs.getString("GID"));
                    json.put("cgnum", rs.getInt("CGNUM"));
                    json.put("price", rs.getString("PRICE"));
                    json.put("user", rs.getString("CUSERID"));
                    json.put("status", rs.getString("STATUS"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch (Exception e)
            {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("orderdetail")) //响应类型26：获取订单详细信息
        {
            Writer out = response.getWriter();
            String orderid = request.getParameter("orderid");
            try{
                PreparedStatement stm = conn.prepareStatement("SELECT * FROM ORDERS WHERE CID = ?");
                stm.setString(1, orderid);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    String t1 = rs.getString("CARTTIME")==null?"":rs.getString("CARTTIME");
                    String t2 = rs.getString("PAYTIME")==null?"":rs.getString("PAYTIME");
                    String t3 = rs.getString("DELITIME")==null?"":rs.getString("DELITIME");
                    String t4 = rs.getString("RECETIME")==null?"":rs.getString("RECETIME");
                    out.write("<script> let date = new Date(); date.setTime(date.getTime() + 2000); document.cookie = 't1="+t1+"&t2="+t2+"&t3="+t3+"&t4="+t4+";expires =' + date.toUTCString(); history.back();</script>");
                }
                rs.close();
                stm.close();
            }
            catch(Exception e){
                e.printStackTrace();
            }
        }
        else if(formtype.equals("deliver")) //响应类型27：确认发货
        {
            Writer out = response.getWriter();
            String orderid = request.getParameter("orderid");
            try{
                PreparedStatement stm = conn.prepareStatement("UPDATE ORDERS SET STATUS = ?, DELITIME = CURRENT_TIMESTAMP WHERE CID = ?");
                stm.setString(1, "已派送");
                stm.setString(2, orderid);
                stm.execute();
                out.write("<script>history.back();</script>");
                stm.close();
            }
            catch(Exception e){
                e.printStackTrace();
            }

        }
        else if(formtype.equals("getlog")) //响应类型28：获取报表信息
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String fromtime = request.getParameter("from");
            String totime = request.getParameter("to");
            String gnum = "0";
            String price = "0";
            List<JSONObject> list = new ArrayList<JSONObject>();
            try{
                PreparedStatement stm0 = conn.prepareStatement("SELECT SUM(CGNUM) AS NUM, SUM(CGPRICE) AS PRICE FROM ORDERS,GOODS WHERE  ORDERS.CGID = GOODS.GID AND GPROVIDER = ? AND ORDERS.RECETIME BETWEEN ? AND ? ;");
                stm0.setString(1, userid);
                stm0.setString(2, fromtime);
                stm0.setString(3, totime);
                JSONObject json0 = new JSONObject();
                json0.put("gid", "所有商品总计");
                json0.put("gname", "");
                ResultSet rs0 = stm0.executeQuery();
                if (rs0.next()) {
                    gnum = rs0.getString("NUM");
                    price = rs0.getString("PRICE");
                    if(gnum==null)
                        gnum = "0";
                    if(price==null)
                        price = "0";
                }
                json0.put("gnum", gnum);
                json0.put("price", price);
                list.add(json0);
                rs0.close();
                stm0.close();

                PreparedStatement stm = conn.prepareStatement("SELECT GID, GNAME, SUM(CGNUM) AS NUM, SUM(CGPRICE) AS PRICE FROM GOODS, ORDERS WHERE GOODS.GID = ORDERS.CGID AND GPROVIDER = ? AND ORDERS.RECETIME BETWEEN ? AND ? GROUP BY GID;");
                stm.setString(1, userid);
                stm.setString(2, fromtime);
                stm.setString(3, totime);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("gid", rs.getString("GID"));
                    json.put("gname", rs.getString("GNAME"));
                    json.put("gnum", rs.getInt("NUM"));
                    json.put("price", rs.getDouble("PRICE"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch(Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("userman")) //响应类型29：客户管理
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String customer = request.getParameter("customer");
            customer = (customer == "") ? "%" : modifyString(customer);
            List<JSONObject> list = new ArrayList<JSONObject>();
            try{
                PreparedStatement stm = conn.prepareStatement("SELECT CUSERID,COUNT(*) AS TOTAL ,MAX(PAYTIME) AS LASTTIME FROM GOODS, ORDERS WHERE GOODS.GID = ORDERS.CGID AND GPROVIDER = ? AND CUSERID LIKE ? GROUP BY CUSERID ORDER BY TOTAL DESC, LASTTIME DESC;");
                stm.setString(1, userid);
                stm.setString(2, customer);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("userid", rs.getString("CUSERID"));
                    json.put("times", rs.getString("TOTAL"));
                    json.put("lasttime", rs.getString("LASTTIME"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch(Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("bloginfo")) //响应类型30：查询客户浏览/购买的日志记录
        {
            Writer out = response.getWriter();
            String userid = session.getAttribute("userid").toString();
            String fromtime = request.getParameter("from");
            String totime = request.getParameter("to");
            List<JSONObject> list = new ArrayList<JSONObject>();
            try{
                PreparedStatement stm = conn.prepareStatement("SELECT * FROM GOODS, BLOG WHERE GOODS.GID = BLOG.GID AND GPROVIDER = ? AND BLOG.OPTIME BETWEEN ? AND ? ORDER BY OPTIME DESC;");
                stm.setString(1, userid);
                stm.setString(2, fromtime);
                stm.setString(3, totime);
                ResultSet rs = stm.executeQuery();
                while (rs.next()) {
                    JSONObject json = new JSONObject();
                    json.put("gid", rs.getString("GID"));
                    json.put("uid", rs.getString("UID"));
                    json.put("op", rs.getInt("OP"));
                    json.put("optime", rs.getString("OPTIME"));
                    list.add(json);
                }
                out.write(list.toString());
                rs.close();
                stm.close();
            }
            catch(Exception e) {
                e.printStackTrace();
            }
        }
        else if(formtype.equals("logout")) //响应类型31：登出系统
        {
            if (session!= null)
                session.invalidate();
            response.sendRedirect("Login.HTML");
        }
        else //响应类型32：默认跳转到登录页面
        {
            Writer out = response.getWriter();
            out.write("<script>window.location.href = 'Login.HTML';</script>");
            if (session!= null)
                session.invalidate();
        }
    }

    public void destroy() {
        // 销毁JDBC对象
        try {
            if (stmt != null)
                stmt.close();
            if (conn != null)
                conn.close();
        } catch (SQLException se) {
            se.printStackTrace();
        }
    }

    public static String modifyString(String s)//变换字符串形式，实现模糊查询
    {
        String temp = "%";
        for (int i = 0; i < s.length(); ++i) {
            temp += s.charAt(i) + "%";
        }
        return temp;
    }

    public static String getFileType(String filePath) //提取文件类型
    {
        File file = new File(filePath);
        String fileName = file.getName();
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex >= 0) {
            return fileName.substring(dotIndex);
        }
        return "";
    }
}