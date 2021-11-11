//引入express模块并使用  相当于var app = express()
var app = require('express')() 
//引入http通信模块,并且开设服务器  http.server(app)
var server = require('http').Server(app)
//引入websoket模块skcket.io,  并且将websoket与Http关联
var io = require('socket.io')(server)
//定义一个常量为空的users数组，用于存储用户数据
const users = []
//监听端口3000
server.listen(3000,() =>{
    console.log('服务器启动成功')
})
//express中的方法, 开放静态资源
app.use(require('express').static('public'))
//处理请求，当请求'/'的时候，服务器响应请求重定向到index.html
app.get('/',function(req,res){
    res.redirect('index.html')
})
//监听连接
io.on('connection', function(socket){
    //监听当用户加入的时候返回数据data
    socket.on('login', data =>{
        //判断如果data在users中存在，说明该用户已经登录，不允许登录
        //如果data在users中不存在，说明该用户没有登录，允许登录
        let user = users.find(item => item.username === data.username)
        //如果user为已经存在的user则输出为loginError
        if(user){
            //监听loginError事件，表示用户已经存在，登录失败，服务器需要给当前用户响应，告诉登录失败
            socket.emit('loginError',{ msg:'登陆失败' })
            console.log('登录失败')
        }else{
            //如果不为已经加入的用户。则把当前用户添加到users中
            users.push(data)
            //监听登录成功loginSuccess事件，告诉用户登录成功
            socket.emit('loginSuccess', data)
            //告诉所有用户有用户加入到聊天室，广播消息
            //socket.emit():告诉当前用户
            //io.emit():广播事件
            io.emit('addUser', data)
            //告诉所有用户目前聊天室有多少人
            io.emit('userList',users)
            //把登录成功的用户头像和用户名保存起来
            socket.username = data.username
            socket.avatar = data.avatar
        }
    })
    //用户断开连接的功能
    //监听用户断开连接
    socket.on('disconnect', () => {
        //把当前用户信息从users中删除
        let idx = users.findIndex(item => item.username === socket.username)
        //从users中删除掉断开连接的这个人
        users.splice(idx, 1)
        //告诉所有人，有人离开了聊天室，广播消息
        io.emit('delUser', {
            username: socket.username,
            avatar: socket.avatar
        })
        //告诉所有人，usersList用户列表发生更新
        io.emit('userList', users)
    })
    //监听聊天的信息
    socket.on('sendMessage', data => {
        //广播给所有的用户
        io.emit('receiveMessage', data)
    })
    //监听发送图片的功能
    socket.on('sendImage', data => {
        //广播给所有用户
        io.emit('receiveImage', data)
    })
})

