<template>
	<div class="login" clearfix>
		<div class="login-wrap">
			<el-row type="flex" justify="center">
				<el-form ref="loginForm" :model="user" :rules="rules" status-icon label-width="80px">
					<h3>登录</h3>
					<hr>
					<el-form-item prop="user_id" label="身份证">
						<el-input v-model="user.user_id" placeholder="请输入身份证" prefix-icon></el-input>
					</el-form-item>
					<el-form-item id="room_id" prop="room_id" label="房间号">
						<el-input v-model="user.room_id" placeholder="请输入房间号"></el-input>
						<!-- </el-form-item>
					<router-link to="/About">找回密码</router-link>
					<router-link to="/Home">注册账号</router-link>
					<el-form-item> -->
						<el-button type="primary" icon="el-icon-upload" @click="reset()">重 置</el-button>
						<el-button type="primary" icon="el-icon-upload" @click="doLogin()">登 录</el-button>
					</el-form-item>
				</el-form>
			</el-row>
		</div>
	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "login",
		data() {
			return {
				user: {
					room_id: "",
					user_id: ""
				}
			};
		},
		created() {},
		methods: {
			doLogin() {
				if (!this.user.user_id) {
					this.$message.error("请输入身份证！");
					return;
				} else if (!this.user.room_id) {
					this.$message.error("请输入房间号！");
					return;
				} else {
					//校验身份证和房间号是否正确;
					// this.$router.push({ path: "/personal" });
					axios.post("/login/", {
							name: this.user.user_id,
							room_id: this.user.room_id
						})
						.then(res => {
							// console.log("输出response.data.status", res.data.status);
							if (res.data.status === 200) {
								this.$router.push({
									path: "/personal"
								});
							} else {
								alert("您输入的身份证或房间号错误！");
							}
						});
				}
			},
			reset() {
				this.user.user_id = '';
				this.user.room_id = '';
			}

		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.login {
		width: 100%;
		height: 1500px;
		background: url("../assets/images/login_bg_min.jpg") no-repeat;
		background-size: cover;
		overflow: hidden;
	}

	.login-wrap {
		background: url("../assets/logo.png") no-repeat;
		background-size: cover;
		width: 600px;
		height: 400px;
		margin: 215px auto;
		overflow: hidden;
		padding-top: 10px;
		line-height: 40px;
	}

	#room_id {
		margin-bottom: 5px;
	}

	h3 {
		color: #0babeab8;
		font-size: 24px;
	}

	hr {
		background-color: #444;
		margin: 20px auto;
	}

	a {
		text-decoration: none;
		color: #aaa;
		font-size: 15px;
	}

	a:hover {
		color: coral;
	}

	.el-button {
		width: 50%;
		margin-top: 20px;
		margin-left: -10px;
	}
</style>
