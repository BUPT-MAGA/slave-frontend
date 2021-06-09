<template>
	<div class="menu">
		<div>
			user_id {{SlaveState.user_id}}
		</div>
		<div>
			room_id {{SlaveState.room_id}}
		</div>
		<el-row>
			<el-col :span="3">
				<div class="button-content"></div>
			</el-col>
			<el-col :span="9">
				<div class="view-bar" id='cost-view' name="cost_view">
					{{ SlaveState.cost + '￥' }}
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
					{{ SlaveState.tar_temp + "℃" }}
				</div>
			</el-col>
			<el-col :span="9">
				<div class="temp-display-content bg-purple" name="cur_temp">
					{{ SlaveState.cur_temp + "℃" }}
				</div>
			</el-col>
			<el-col :span="3">
				<div class="button-content"></div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="6">
				<div class="button-content"> </div>
			</el-col>
			<el-col :span="4">
				<div class="button-content">
					<el-button type="primary" @click="temp_sub_onclick()" name="temp_sub" icon="el-icon-minus"
						class="temp-control" circle></el-button>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="button-content">
					<el-button type="primary" @click="speed_control_onclick()" name="speed_control" class="temp-control"
						circle>
						<i class="fa fa-circle-o-notch"></i>
					</el-button>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="button-content">
					<el-button type="primary" @click="temp_add_onclick()" name="temp_add" icon="el-icon-plus"
						class="temp-control" circle></el-button>
				</div>
			</el-col>

			<el-col :span="6">
				<div class="button-content"></div>
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
				fan_src: require("@/assets/images/fan0.png"),
				mode_src: require("@/assets/images/snow.png"),
			};
		},
		mounted() {
			// alert("mounted!!!")
			// this.room_data.room_id = this.$route.params.room_id;
			// this.room_data.user_id = this.$route.params.user_id;
			// this.ws = new WebSocket("ws://127.0.0.1:6789/");

			// this.ws.onerror = this.onError(event)
			// this.ws.onclose = this.onClose(event)
			// this.ws.onmessage = this.onMessage(event)
			// this.ws.onopen = this.onOpen(event)
		},
		computed: {
			SlaveState() {
				return this.$store.state.SlaveState;
			}
		},
		methods: {

			temp_add_onclick() {
				if (!this.SlaveState.power_mode) return;
				if (this.SlaveState.tar_temp >= 30) {
					this.$notify({
						title: 'Warn',
						message: '最高设定温度为30℃',
						type: 'warning',
						duration: 2000
					});
					return;
				}
				this.$store.commit('TempAdd');
				this.$notify({
					title: 'Add',
					message: '设定温度为' + this.SlaveState.tar_temp,
					type: 'success',
					duration: 1000
				});
			},
			temp_sub_onclick() {
				if (!this.SlaveState.power_mode) return;
				if (this.SlaveState.tar_temp <= this.SlaveState.center_air_temp) {
					this.$notify({
						title: 'Warn',
						message: '最低设定温度为' + this.SlaveState.center_air_temp + '℃',
						type: 'warning',
						duration: 2000
					});
					return;
				}
				this.$store.commit('TempSub');
				this.$notify({
					title: 'Sub',
					message: '设定温度为' + this.SlaveState.tar_temp,
					type: 'success',
					duration: 1000
				});
			},
			heating_onclick() {
				if (!this.SlaveState.power_mode) return;
				if (this.SlaveState.mode == 1) {
					return;
				}
				this.SlaveState.mode = 1;
				this.$notify({
					title: 'Mode',
					message: '已设置为制热模式',
					type: 'success',
					duration: 2000
				});
				this.mode_src = require("@/assets/images/sun.png")
			},
			cooling_coclick() {
				if (!this.SlaveState.power_mode) return;
				if (this.SlaveState.mode == 0) {
					return;
				}
				this.SlaveState.mode = 0;
				this.$notify({
					title: 'Mode',
					message: '已设置为制冷模式',
					type: 'success',
					duration: 2000
				});
				this.mode_src = require("@/assets/images/snow.png")
			},
			speed_control_onclick() {
				if (!this.SlaveState.power_mode) return;
				var speed = this.SlaveState.speed;
				speed = (speed + 1) % 3;
				this.SlaveState.speed = speed;
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
				this.fan_src = require("@/assets/images/fan" + speed + '.png')
			},
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
		/* margin-top: 50%; */
		border-radius: 0px;
		min-height: 53px;
		background-image: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
	}

	#cost-view {
		padding-top: 15px;
		font-size: 2em;
	}
</style>
