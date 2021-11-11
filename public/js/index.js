const socket = io('http://127.0.0.1:3000')
var username,avatar
$('#login_avatar li').on('click', function(){
    $(this).addClass('now')
    .siblings()
    .removeClass('now')
})


$('#loginBtn').on('click',function(){
        var username = $('.username').val().trim()
        if(!username){
            alert('用户名不能为空')
            return
        }
        var avatar = $('#login_avatar li.now img').attr('src')

        socket.emit('login',{
            username:username,
            avatar:avatar
        })
})

socket.on('loginError', data =>{
    alert('用户名已存在')
})

socket.on('loginSuccess', data =>{
    $('.login').fadeOut()
    $('.centainer').fadeIn()
    $('.current_url').attr('src',data.avatar)
    $('.info .username').text(data.username)
    username = data.username
    avatar = data.avatar 
})
socket.on('addUser', data =>{
    $('.right_center').append(`
    <div class="system">
            <div class="informat">${data.username}加入了群聊</div>
    </div>
    `)
    scrollIntoView()
 })
 socket.on('delUser', data =>{
    $('.right_center').append(`
    <div class="system">
            <div class="informat">${data.username}离开了群聊</div>
    </div>
    `)
    scrollIntoView()
 })

socket.on('userList', data =>{
    $('.curr_user ul').html('')
    data.forEach(item => {
         $('.side_bar .curr_user ul').append(`
            <li class="user">
                <div class="ava"><img src="${item.avatar}" width="40px" height="40px" alt=""></div>
                <div class="name">${item.username}</div>
            </li>
         `)
     })
     $('#userCount').text(data.length)
 })
 $('.send_msg').on('click',() => {
    var contant = $('.messa').html()
    $('.messa').html('')
    if(!contant){
        return alert('请输入内容')
    }else{
        socket.emit('sendMessage', {
            msg:contant,
            username:username,
            avatar:avatar
        })
    }
})

 socket.on('receiveMessage', data =>{
    if(data.username === username){
        $('.right_center').append(`
        <div class="r-message-box">
        <div class="other-message">
            <div class="other-contant">
                <div class="bubble">
                    <div class="bubble_cont">${data.msg}</div>
                </div>
            </div>
            <img src="${data.avatar}" width="40px" height="40px" alt="">
        </div>
        </div>
        <div style="clear:both"></div>
    `)
    }else{
       $('.right_center').append(`
       <div class="l-message-box">
       <div class="my-message">
           <img src="${data.avatar}" width="40px" height="40px" alt="">
           <div class="nickname">${data.username}</div>
       <div class="contant">
           <div class="bubble">
               <div class="bubble_cont">${data.msg}</div>
           </div>
       </div>
       </div>
   </div> 
   <div style="clear:both"></div>
       `)
    }
    scrollIntoView()
})

function scrollIntoView(){
    $('.right_center')
.children(':last')
.get(0)
.scrollIntoView(false)
}
$('#file').on('change', function(){
    var file = this.files[0]
    var fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload = function(){
        socket.emit('sendImage', {
            username:username,
            avatar:avatar,
            img:fr.result
        })
    }
})
socket.on('receiveImage', data =>{
    if(data.username === username){
        $('.right_center').append(`
        <div class="r-fix_img">
        <div class="r-fix_im">
            <img src="${data.img}" width="160px" height="160px">
        </div>
        <div class="r-cont_im">
        <img src="${data.avatar}" width="40px" height="40px" alt="">
        </div>
        </div>
        <div style="clear:both"></div>
    `)
    }else{
       $('.right_center').append(`
       <div class="l-fix_img">
       <div class="l-fix_im">
           <img src="${data.img}" width="160px" height="160px">
       </div>
       <div class="l-cont_im">
       <img src="${data.avatar}" width="40px" height="40px" alt="">
       <div class="l-nickname">${data.username}</div>
       </div>
       </div>
   <div style="clear:both"></div>
       `)
    }
    scrollIntoView()
})

$('.biaoqing').on('click', function(){
    $('.messa').emoji({
        button: ".biaoqing",
        showTab: false,
        animation: 'slide',
        position: 'topRight',
        icons: [{
        name: "QQ表情",
        path: "lib/img/qq/",
        maxNum: 91,
        excludeNums: [41, 45, 54],
        file: ".gif"
        }]
    })
})