<template>
	<div class="menu">
		<h1>This is an menu page</h1>
		<div>
			<el-image :src="fan0_src"></el-image>
		</div>
		<el-row>
			<el-col :span="3">
				<div class="button-content"></div>
			</el-col>
			<el-col :span="9">
				<div class="temp-display-content bg-purple" name="speed_view">
				</div>
			</el-col>
			<el-col :span="9">
				<div class="temp-display-content bg-purple" name="mode_view">
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
				room_data: {
					room_id: "",
					user_id: "",
					cur_temp: 26,
					tar_temp: 28,
					mode: "",
					cost: 0.0,
					speed: "",
					rate: 0,
					power_mode: 0,
				},
				fan0_src: '../assets/images/fan0.png',
				// fan0_src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
				
			};
		},
		created() {},
		methods: {
			temp_add_onclick() {
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
				if (this.room_data.tar_temp <= 16) {
					this.$notify({
						title: 'Warn',
						message: '最低设定温度为16℃',
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
				if (this.room_data.mode == '1') {
					return;
				}
				this.room_data.mode = '1';
				this.$notify({
					title: 'Mode',
					message: '已设置为制热模式',
					type: 'success',
					duration: 2000
				});
			},
			cooling_coclick() {
				if (this.room_data.mode == '0') {
					return;
				}
				this.room_data.mode = '0';
				this.$notify({
					title: 'Mode',
					message: '已设置为制冷模式',
					type: 'success',
					duration: 2000
				});
			},
			speed_control_onclick() {
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
		font-size: 80px;
	}

	.bg-purple {
		background: #d3dce6;
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
</style>
