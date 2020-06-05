// 登录拦截

const guard = (req, res, next) => {
  // 判断用户是否为登录页面
  // 如果不是登录页面，并且session不存在，那么就重定向到登录页面
  // 如果不是登录页面，且session存在 就重定向到编写文章页面
  if(req.url !== '/login' && !req.session.username){
    res.redirect('/login');
  }else{
    // 如果登录的是管理员账号，就调到管理页面
      if(req.session.role === 'admin'){
        return res.redirect('/admin/user')
      }
      next();
  }

}