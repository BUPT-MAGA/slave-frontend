<template>
	<el-container class="login" clearfix>
		<el-card class="login-wrap">
			<div>
				<img style="margin: 0 20%;width: 18%" src='../assets/maga.png' />
			</div>
			<el-button style="margin-top:3vh; margin-left: 0%" @click="show = !show;  active = 1" v-if="!show"
				type="primary" icon="el-icon-right" circle></el-button>
			<el-row type="flex" justify="center">
				<transition name="el-zoom-in-center">
					<el-form ref="loginForm" :model="user" v-if="show" status-icon label-width="80px">
						<!-- <h3>登录</h3> -->
						<hr>
						<el-form-item prop="user_id" label="身份证">
							<el-input v-model="user.user_id" placeholder="请输入身份证" prefix-icon></el-input>
						</el-form-item>
						<el-form-item id="room_id" prop="room_id" label="房间号">
							<el-input v-model="user.room_id" placeholder="请输入房间号"></el-input>
							<el-button style="margin:0 5%; width: 30%;" type="primary" icon="el-icon-delete-solid"
								@click="reset()">重 置</el-button>
							<el-button style="margin:0 10%; width: 30%;" type="primary" icon="el-icon-upload"
								@click="doLogin(user.room_id, user.user_id)">登 录
							</el-button>
						</el-form-item>
					</el-form>
				</transition>
			</el-row>
			<el-steps style="margin-top: 2vh" :active="active" :space="200" finish-status="success" align-center>
				<el-step title="进入网站首页"></el-step>
				<el-step title="进行身份认证"></el-step>
				<el-step title="进行您的设定"></el-step>
			</el-steps>
		</el-card>
	</el-container>
</template>

<script>
	// import axios from "axios";
	export default {
		name: "login",
		data() {
			return {
				user: {
					room_id: "",
					user_id: ""
				},
				show: 0,
				active: 0,
				rules: {
					user_id: [{
						required: true,
						message: '身份证号不可为空',
						trigger: 'blur'
					},
					{
						min: 6,
						max: 12,
						message: '长度在 6 到 12 个字符',
						trigger: 'blur'
					},
					],
					room_id: [{
							required: true,
							message: '密码不可为空',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '长度在 6 到 12 个字符',
							trigger: 'blur'
						}
					],
				}
			};
		},
		created() {

		},
		computed: {

		},
		methods: {
			doLogin(room_id, user_id) {
				if (!this.user.user_id) {
					this.$message.error("请输入身份证！");
					return;
				} else if (!this.user.room_id) {
					this.$message.error("请输入房间号！");
					return;
				} else {
					console.log(user_id)
					console.log(room_id)
					// var url = `ws://10.128.197.119:8080/ws/?room_id=${room_id}&user_id=${user_id}`
					var url = "ws://127.0.0.1:6789/"
					console.log(url)
					this.$store.state.ws = new WebSocket(url);
					this.$store.state.ws.onopen = this.open
					// 监听ws错误信息
					this.$store.state.ws.onerror = this.error
					// 监听ws消息
					this.$store.state.ws.onmessage = this.getMessage
					this.$store.state.ws.onclose = this.close
				}
			},
			reset() {
				this.user.user_id = '';
				this.user.room_id = '';
			},
			open: function() {
				console.log("socket连接成功")

				this.$store.commit('UpdateUserInfo', {
					user_id: this.user.user_id,
					room_id: this.user.room_id
				});

				this.$router.push({
					path: `/users`,
				})
			},
			error: function() {
				this.$notify({
					title: '错误',
					message: '连接失败',
					type: 'error',
					duration: 2000
				});
				console.log("连接错误")
			},
			getMessage: function(msg) {
				console.log(msg.data)
			},
			send: function() {
				console.log("send message")
			},
			close: function() {
				console.log("socket已经关闭")
			}

		},


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
		/* background: url("../assets/logo.png") no-repeat; */
		background-color: rgba(255, 255, 255, 0.4);
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

	/* .el-button {
		width: 50%;
		margin-top: 20px;
		margin-left: -10px;
	} */
</style>
