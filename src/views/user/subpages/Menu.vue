<template>
	<div class="menu">
		<div>
			user_id {{room_data.user_id}}
		</div>
		<div>
			room_id {{room_data.room_id}}
		</div>
		<el-row>
			<el-col :span="3">
				<div class="button-content"></div>
			</el-col>
			<el-col :span="9">
				<div class="view-bar" id='cost-view' name="cost_view">
					{{ room_data.cost + '￥' }}
				</div>
			</el-col>
			<el-col :span="5">
				<div class="view-bar" name="speed_view">
					<img alt="fan" v-bind:src='fan_src'>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="view-bar" name="mode_view">
					<img alt="mode" v-bind:src='mode_src'>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="button-content"></div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="3">
				<div class="button-content"></div>
			</el-col>
			<el-col :span="9">
				<div class="temp-display-content bg-purple" name="tar_temp">
					{{ room_data.tar_temp + "℃" }}
				</div>
			</el-col>
			<el-col :span="9">
				<div class="temp-display-content bg-purple" name="cur_temp">
					{{ room_data.cur_temp + "℃" }}
				</div>
			</el-col>
			<el-col :span="3">
				<div class="button-content"></div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="3">
				<div class="button-content"> </div>
			</el-col>
			<el-col :span="3">
				<div class="button-content">
					<el-button type="danger" @click="power_onclick()" name="power" class="temp-control" circle>
						<i class="fa el-icon-switch-button"></i>
					</el-button>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="button-content">
					<el-button type="primary" @click="speed_control_onclick()" name="speed_control" class="temp-control"
						circle>
						<i class="fa fa-circle-o-notch"></i>
					</el-button>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="button-content">
					<el-button type="primary" @click="temp_sub_onclick()" name="temp_sub" icon="el-icon-minus"
						class="temp-control" circle></el-button>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="button-content">
					<el-button type="primary" @click="temp_add_onclick()" name="temp_add" icon="el-icon-plus"
						class="temp-control" circle></el-button>
				</div>
			</el-col>

			<el-col :span="3">
				<div class="button-content">
					<el-button type="primary" @click="heating_onclick()" name="heating" class="temp-control" circle><i
							class="fa fa-sun-o"></i>
					</el-button>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="button-content">
					<el-button type="primary" @click="cooling_coclick()" name="cooling" class="temp-control" circle><i
							class="fa fa-snowflake-o"></i></el-button>
				</div>
			</el-col>
			<el-col :span="3">
				<div></div>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		name: "login",
		data() {
			return {
				ws: null,
				data_timer: null,
				require_timer: null,
				room_data: {
					room_id: "",
					user_id: "",
					cur_temp: 26,
					tar_temp: 28,
					center_air_temp: 20,
					mode: 0,
					cost: 0.0,
					speed: 0,
					interval: 0,
					power_mode: 0,
				},
				fan_src: require("../assets/images/fan0.png"),
				mode_src: require("../assets/images/snow.png"),
			};
		},
		mounted() {
			alert("mounted!!!")
			this.room_data.room_id = this.$route.params.room_id;
			this.room_data.user_id = this.$route.params.user_id;
			this.ws = new WebSocket("ws://127.0.0.1:6789/");

			this.ws.onerror = this.onError(event)
			this.ws.onclose = this.onClose(event)
			this.ws.onmessage = this.onMessage(event)
			this.ws.onopen = this.onOpen(event)
		},
		created() {},
		methods: {
			send_data() {
				console.log("send_data");
				this.ws.send(JSON.stringify({
					event_id: 7,
					data: {
						cur_temp: this.room_data.cur_temp,
						tar_temp: this.room_data.tar_temp,
						mode: this.room_data.mode,
						speed: this.room_data.speed
					}
				}))
			},
			require_from_center() {
				console.log("require_center");
				// this.ws.send(JSON.stringify({
				// 	event_id: 2,
				// 	data: {
				// 		mode: this.room_data.mode,
				// 		speed: this.room_data.speed
				// 	}
				// }))
			},
			onError: function(evt) {
				alert('连接失败');
				evt
			},
			onOpen: function(evt) {
				alert('连接成功');
				this.data_timer = setInterval(this.send_data, 1000);
				this.require_timer = setInterval(this.require_from_center, 1000);
				evt
			},
			onClose: function(evt) {
				clearInterval(this.require_timer);
				clearInterval(this.data_timer);
				alert('关闭');
				evt
			},
			onMessage: function(evt) {
				alert('收到消息');
				evt
				// var message = JSON.parse(evt.data);
				// var eve_id = message.event_id;
				// var data = message.data;
				// switch (eve_id) {
				// 	case 1:
				// 		/* 中央空调状态反馈 */
				// 		this.room_data.center_air_temp = data.temp;
				// 		if (data.mode) {
				// 			this.heating_onclick();
				// 		} else {
				// 			this.cooling_coclick();
				// 		}
				// 		break;
				// 	case 3:
				// 		/* 主机送风 */
				// 		var temp_dif = data.temp - this.room_data.cur_temp;
				// 		this.room_data.cur_temp += temp_dif * 0.001 * data.speed;
				// 		this.room_data.cost += data.cost;
				// 		break;
				// 	case 5:
				// 		/* 主机同意停止送风 */
				// 		console.log('主机已停止送风')
				// 		break;
				// 	case 6:
				// 		/* 设置从机状态汇报频率 */
				// 		this.room_data.interval = data.interval;
				// 		clearInterval(this.require_timer);
				// 		this.require_timer = setInterval(this.require_from_center, this.room_data.interval);
				// 		break;
				// }
			},
			temp_add_onclick() {
				if (!this.room_data.power_mode) return;
				if (this.room_data.tar_temp >= 30) {
					this.$notify({
						title: 'Warn',
						message: '最高设定温度为30℃',
						type: 'warning',
						duration: 2000
					});
					return;
				}
				this.room_data.tar_temp += 1;
				this.$notify({
					title: 'Add',
					message: '设定温度为' + this.room_data.tar_temp,
					type: 'success',
					duration: 1000
				});
			},
			temp_sub_onclick() {
				if (!this.room_data.power_mode) return;
				if (this.room_data.tar_temp <= this.room_data.center_air_temp) {
					this.$notify({
						title: 'Warn',
						message: '最低设定温度为' + this.room_data.center_air_temp + '℃',
						type: 'warning',
						duration: 2000
					});
					return;
				}
				this.room_data.tar_temp -= 1;
				this.$notify({
					title: 'Sub',
					message: '设定温度为' + this.room_data.tar_temp,
					type: 'success',
					duration: 1000
				});
			},
			heating_onclick() {
				if (!this.room_data.power_mode) return;
				if (this.room_data.mode == 1) {
					return;
				}
				this.room_data.mode = 1;
				this.$notify({
					title: 'Mode',
					message: '已设置为制热模式',
					type: 'success',
					duration: 2000
				});
				this.mode_src = require("../assets/images/sun.png")
			},
			cooling_coclick() {
				if (!this.room_data.power_mode) return;
				if (this.room_data.mode == 0) {
					return;
				}
				this.room_data.mode = 0;
				this.$notify({
					title: 'Mode',
					message: '已设置为制冷模式',
					type: 'success',
					duration: 2000
				});
				this.mode_src = require("../assets/images/snow.png")
			},
			speed_control_onclick() {
				if (!this.room_data.power_mode) return;
				var speed = this.room_data.speed;
				speed = (speed + 1) % 3;
				this.room_data.speed = speed;
				var str = ""
				switch (speed) {
					case 0:
						str = "低风速";
						break;
					case 1:
						str = "中风速";
						break;
					case 2:
						str = "高风速";
						break;
				}
				this.$notify({
					title: 'Speed',
					message: '风速已设置：' + str,
					type: 'success',
					duration: 2000
				});
				this.fan_src = require("../assets/images/fan" + speed + '.png')
			},
			power_onclick() {
				if (this.room_data.power_mode) {
					this.room_data.power_mode = 0;
					this.$notify({
						title: 'Speed',
						message: '已关机',
						type: 'success',
						duration: 2000
					});
					this.ws.send(JSON.stringify({
						event_id: 4,
						data: {}
					}))
					this.room_data.cost = 0;
					
				} else {
					this.room_data.power_mode = 1;
					this.$notify({
						title: 'Speed',
						message: '开机成功',
						type: 'success',
						duration: 2000
					});
				}

			}
		}
	};
</script>
<style>
	.temp-control {
		font-size: 30px;
	}

	.bg-purple {
		background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
	}

	.button-content {
		border-radius: 4px;
		min-height: 36px;

	}

	.temp-display-content {
		border-radius: 4px;
		min-height: 300px;
		font-size: 50px;
		text-align: center;
		padding-top: 200px;
	}

	.view-bar {
		border-radius: 0px;
		min-height: 53px;
		background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
	}

	#cost-view {
		padding-top: 15px;
		font-size: 2em;
	}
</style>
