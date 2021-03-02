import { $http } from "./../tools";

// *******************动态文章数据请求模块 START ******************
// 请求 ’前端动态‘ 文章
export async function reqDynamic(reqData = {}, method = "GET") {
  return $http("/public/dynamic-article", reqData, method);
}
// 请求热门文章
export async function reqHotArt(reqData = {}, method = "GET") {
  return $http("/public/hot-article", reqData, method);
}

// 请求跑马灯文章
export async function reqCarArt(reqData, method = "GET") {
  return $http("/public/carousel-article", reqData, method);
}

// 根据文章的ID来查看文章
export async function reqArtById(reqData = {}, method = "GET") {
  return $http("/public/show-article", reqData, method);
}

// *******************动态文章数据请求模块 END ******************

// ******************* 资源共享文章数据 请求模块 START *****************
export async function reqResource(reqData = {}, method = "GET") {
  return $http("/public/resource-article", reqData, method);
}
// ******************* 资源共享文章数据 请求模块 END *****************

// ******************* 数据结构&算法 请求模块 START *****************
export async function reqAlgorithm(reqData = {}, method = "GET") {
  return $http("/public/algorithm-article", reqData, method);
}
// ******************* 数据结构&算法 请求模块 END *****************

// ******************* 用户中心 请求模块 START *****************
export async function reqArtByUid(reqData, method = "GET") {
  return $http("/user/artinfo", reqData, method);
}

// 用户注册时获取验证码captcha
export async function reqGetCaptcha(reqData = {}, method = "GET") {
  return $http("/public/captcha", reqData, method);
}
// 用户登录时获取验证码captcha
export async function reqLoginCaptcha(reqData = {}, method = "GET") {
  return $http("/public/log-captcha", reqData, method);
}
// 用户注册
export async function reqRegister(reqData = {}, method = "POST") {
  return $http("/public/register", reqData, method);
}
// 用户登录
export async function reqLogin(reqData = {}, method = "POST") {
  return $http("/public/login", reqData, method);
}

export async function reqUserByUid(reqData, method = "GET") {
  return $http("/user/uinfo", reqData, method);
}

export async function reqUpdateUserInfo(reqData, method = "POST") {
  return $http("/user/update-userinfo", reqData, method);
}
// 修改用户头像
export async function reqModAvatar(reqData, method = "POST") {
  return $http("/user/change-avatar", reqData, method);
}

// ******************* 用户中心 请求模块 END *****************

// ******************* 用户中心 操作文章模块 START *****************

// 发表文章
export async function reqAddArt(reqData = {}, method = "POST") {
  return $http("/user/write", reqData, method);
}
// 发表文章时保存上传图片
export async function reqAddPic(reqData = {}, method = "POST") {
  return $http("/user/pic-write", reqData, method);
}
// 修改文章
export async function reqModifyArt(reqData = {}, method = "POST") {
  return $http("/user/modifyArt", reqData, method);
}
// 退出登录操作
export async function reqLogOut(reqData = {}, method = "GET") {
  return $http("/user/logout", reqData, method);
}
// 删除文章
export async function reqDeleteArt(reqData, method = "POST") {
  return $http("/user/deleteArt", reqData, method);
}
// 修改用户的基本信息
export async function reqModifyUpass(reqData, method = "POST") {
  return $http("/user/modify-pass", reqData, method);
}
// 实现点赞
export async function reqHitLike(reqData, method = "POST") {
  return $http("/user/hit-like", reqData, method);
}

// ******************* 用户中心 请求模块 END *****************

// ******************* 显示文章 评论模块 START *****************
// 给文章做评论
export async function reqCommentArt(url, reqData = {}, method = "GET") {
  return $http(url, reqData, method);
}
// 请求文章的评论
export async function reqCommentData(url, reqData = {}, method = "GET") {
  return $http(url, reqData, method);
}

// ******************* 显示文章 评论 END *****************

// ******************* admin/article 文章管理 START *****************
// 在管理页面获取所有的文章
export async function reqAllArt(reqData = {}, method = "GET") {
  return $http("/admin/all-article", reqData, method);
}
// admin获取所有的用户信息
export async function reqAllUser(reqData = {}, method = "GET") {
  return $http("/admin/all-user", reqData, method);
}
// admin根据id删除用户
export async function reqDelByUid(reqData = {}, method = "POST") {
  return $http("/admin/delete-byuid", reqData, method);
}
// admin添加一个用户
export async function reqAddUser(reqData = {}, method = "POST") {
  return $http("/admin/adduser", reqData, method);
}
// admin修改一个用户
export async function reqModUser(reqData = {}, method = "POST") {
  return $http("/admin/modify-user", reqData, method);
}
// ******************* 文章管理 评论 END *****************

// ******************* 用户中心 操作文章模块 START *****************
export async function reqRssArticles(reqData = {}, method = "GET") {
  return $http("/public/rss",reqData,method);
}
// ******************* 用户中心 操作文章模块 END *******************
