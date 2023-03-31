const sql = require('mssql');

const axios = require('axios');

let axiosConfig = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.twitter.com/2/users/me?user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=author_id,created_at',
  headers: { 
    'Authorization': 'OAuth oauth_consumer_key="KUpSBqAkj1t3fVHokUNY1U2Kg",oauth_token="1641375519391268864-1iEr0EcuwqeVGQGufTuyoH5oQoAX8W",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1680255949",oauth_nonce="gMSsxxFC657",oauth_version="1.0",oauth_signature="%2F5sAwXjIxcjptwOHa2QOX5VThBA%3D"', 
    'Cookie': 'guest_id=v1%3A168017101688240157; guest_id_ads=v1%3A168017101688240157; guest_id_marketing=v1%3A168017101688240157; personalization_id="v1_QFaIgW6sVUyF3L8gQFgQQQ=="'
  }
};

// axios.request(axiosConfig)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });

const config = {
    user: 'saud', // better stored in an app setting such as process.env.DB_USER
    password: 'Spider12345', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'assesment-task.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'assesmentDb', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}


console.log("Starting...");
connectAndQuery();

async function connectAndQuery() {
    try {


        let response
        response = await axios.request(axiosConfig)
        console.log("response", response?.data?.data?.name, response?.data?.data?.username)
        let name = response?.data?.data?.name ?? "Saud"
        let CompanyName = response?.data?.data?.username ?? "Xint Solutions"
        var poolConnection = await sql.connect(config);

        console.log("Inserting rows in the Table...");
        // let banana = 'banana'
        var insertResult = await poolConnection
        .request()
        .query("INSERT INTO [SalesLT].[Customer] ([NameStyle], [FirstName], [LastName], [CompanyName], [PasswordHash], [PasswordSalt]) VALUES ('False', '"+name+"', 'Saud', '"+CompanyName+"', 'asdf2321dsasdas', 'asdfadsf');")
        console.log(insertResult)
        console.log("Reading rows from the Table...");
        // var resultSet = await poolConnection.request().query(`SELECT TOP 50 pc.Name as CategoryName,
        //     p.name as ProductName 
        //     FROM [SalesLT].[ProductCategory] pc
        //     JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid`);
        var resultSet = await poolConnection.request().query(`SELECT TOP (2) c.FirstName, c.lastName, c.NameStyle, c.CompanyName FROM [SalesLT].[Customer] c ORDER BY c.ModifiedDate DESC;`);

        console.log(`${resultSet.recordset.length} rows returned.`, resultSet?.recordset);

        // output column headers
        // var columns = "";
        // for (var column in resultSet.recordset.columns) {
        //     columns += column + ", ";
        // }
        // console.log("%s\t", columns.substring(0, columns.length - 2));

        resultSet?.recordset?.map(e => {
            console.log("FirstName", e?.FirstName, "LastName", e?.lastName, "NameStyle", e?.NameStyle, "CompanyName", e?.CompanyName)
        })

        // // ouput row contents from default record set
        // resultSet.recordset.forEach(row => {
        //     console.log("%s\t%s", row.CategoryName, row.ProductName);
        // });

        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}