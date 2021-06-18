<template>

	<el-container style="height: 100vh; border: 1px solid #eee">
		<el-aside width="20vw" style="background-color: rgb(84, 92, 100)">
			<el-menu :default-active="default_selected" @select="showChange" background-color="#545c64"
				text-color="#fff" active-text-color="#ffd04b">
				<el-menu-item index="setting">
					<template slot="title"><i class="el-icon-set-up"></i>调节</template>
				</el-menu-item>
				<el-menu-item index="money">
					<template slot="title"><i class="el-icon-coin"></i>计费</template>
				</el-menu-item>
				<el-menu-item index="temp">
					<template slot="title"><i class="el-icon-odometer"></i>房间温度</template>
				</el-menu-item>
			</el-menu>
		</el-aside>

		<el-container>
			<el-header>
				
				<el-popover style="" trigger="click">
					<el-button slot="reference" type="primary" round>立即付款</el-button>
					<div>
						<img style="margin:0 50%;width: 30%" src='../../assets/logo.png' />
					</div>
				</el-popover>
				<img style="width: 15%" src='../../assets/maga.png' />
				<el-button style="margin:0 1%" type="primary" round @click="power_onclick()">关机</el-button>
				
			</el-header>

			<el-main>
				<span></span>
				<div v-show="show_setting">
					<Menu></Menu>
				</div>

				<div v-show="show_money">
					<Charts id='moneyCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.moneylist'>
					</Charts>
				</div>

				<div v-show="show_temp">
					<charts id='tempCharts' :timelist='this.RoomInfo.timelist' :datalist='this.RoomInfo.templist'>
					</charts>
				</div>
			</el-main>
		</el-container>
	</el-container>

</template>
<script>
	import menu from '@/views/users/subpages/menu'
	import charts from '@/views/users/subpages/charts.vue'
	export default {
		name: 'Users',
		components: {
			Menu: menu,
			Charts: charts
		},
		data() {
			return {
				default_selected: 'menu',
				show_setting: true,
				show_money: false,
				show_temp: false,
				speed_state: 0,
				RoomInfo: {
					timelist: [],
					templist: [],
					moneylist: []
				},
				Timer: {
					timer0: null,
					timer1: null,
					timer2: null,
					timer3: null
				}
			}
		},
		mounted() {
			this.init()
			this.Timer.timer0 = setInterval(this.getlist, 5000)
			
			
			this.Timer.timer1 = setInterval(this.send_data, 1000)
			console.log("Timer")
			console.log(this.Timer.timer1)
			this.Timer.timer2 = setInterval(this.tempNatualAdd, 500)
			this.Timer.timer3 = setInterval(this.updateState, 1000)
			this.$store.state.ws.onerror = this.onError
			this.$store.state.ws.onclose = this.onClose
			this.$store.state.ws.onmessage = this.onMessage
		},
		computed: {
			PowerMode() {
				return this.$store.state.SlaveState.power_mode
			},
			SlaveState() {
				return this.$store.state.SlaveState
			},
			ws() {
				return this.$store.state.ws
			}
		},
		methods: {
			updateState(){
				if(this.SlaveState.mode){
					if(this.speed_state == 0 && this.SlaveState.cur_temp < this.SlaveState.tar_temp - 1){
						this.speed_state = 1
					}
					if(this.speed_state == 1 && this.SlaveState.cur_temp > this.SlaveState.tar_temp){
						this.speed_state = 0
					}
				}else{
					if(this.speed_state == 0 && this.SlaveState.cur_temp > this.SlaveState.tar_temp + 1){
						this.speed_state = 1
					}
					if(this.speed_state == 1 && this.SlaveState.cur_temp < this.SlaveState.tar_temp){
						this.speed_state = 0
					}
				}
			},
			/**
			 * init() 初始化
			 */
			init() {
				this.RoomInfo.timelist.push(0)
				this.RoomInfo.templist.push(this.SlaveState.cur_temp)
				this.RoomInfo.moneylist.push(0)
			},
			/**
			 * showChange() 切换页面
			 */
			showChange(type, p) {
				if (type === 'money') {
					this.show_money = true
					this.show_setting = false
					this.show_temp = false
				} else if (type === 'setting') {
					this.show_money = false
					this.show_setting = true
					this.show_temp = false
				} else if (type === 'temp') {
					this.show_money = false
					this.show_setting = false
					this.show_temp = true
				}
				//use p
				console.log(p);
			},
			/**
			 * getlist() 更新列表
			 */
			getlist() {
				this.$store.commit('UpdateUseTime', 5)
				this.RoomInfo.timelist.push(this.SlaveState.use_time)
				this.RoomInfo.templist.push(this.SlaveState.cur_temp)
				this.RoomInfo.moneylist.push(this.SlaveState.cost)
			},
			tempNatualAdd() {
				var temp_dif = this.SlaveState.room_temp - this.SlaveState.cur_temp;
				var add_temp = temp_dif * 0.05 * 0.1;
				// var add_temp = 0.05;
				this.$store.commit('UpdateRoomInfo', {
					add_temp: add_temp,
					add_cost: 0,
				})
			},

			power_onclick() {
				this.$notify({
					title: 'Speed',
					message: '已关机',
					type: 'success',
					duration: 2000
				});
				this.ws.close()
			},
			send_data() {
				if(this.SlaveState.mode == 1){
					if (this.SlaveState.cur_temp < this.SlaveState.tar_temp && this.speed_state) {
						this.$store.commit('UpdateSpeedStr', 1)
						this.ws.send(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: this.SlaveState.mode,
								speed: this.SlaveState.speed
							}
						}))
						console.log(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: this.SlaveState.mode,
								speed: this.SlaveState.speed
							}
						}))
					} else {
						this.$store.commit('UpdateSpeedStr', 0) 
						this.ws.send(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: 2,
								speed: this.SlaveState.speed
							}
						}))
						console.log(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: 2,
								speed: this.SlaveState.speed
							}
						}))
					}
				}else{
					if (this.SlaveState.cur_temp > this.SlaveState.tar_temp && this.speed_state) {
						this.$store.commit('UpdateSpeedStr', 1)
						this.ws.send(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: this.SlaveState.mode,
								speed: this.SlaveState.speed
							}
						}))
						console.log(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: this.SlaveState.mode,
								speed: this.SlaveState.speed
							}
						}))
					} else {
						this.$store.commit('UpdateSpeedStr', 0)
						this.ws.send(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: 2,
								speed: this.SlaveState.speed
							}
						}))
						console.log(JSON.stringify({
							event_id: 7,
							data: {
								cur_temp: Math.ceil(this.SlaveState.cur_temp),
								tar_temp: this.SlaveState.tar_temp,
								mode: 2,
								speed: this.SlaveState.speed
							}
						}))
					}
				}
			},
			heating_onclick() {
				if (this.SlaveState.mode == 1) {
					return;
				}
				this.$store.commit('UpdateMode', 1)
				this.$store.commit('UpdateRoomTemp', 18)
				this.$notify({
					title: 'Mode',
					message: '已设置为制热模式',
					type: 'success',
					duration: 2000
				});
			},
			cooling_coclick() {
				if (this.SlaveState.mode == 0) {
					return;
				}
				this.$store.commit('UpdateMode', 0)
				this.$store.commit('UpdateRoomTemp', 30)
				this.$notify({
					title: 'Mode',
					message: '已设置为制冷模式',
					type: 'success',
					duration: 2000
				})
			},
			onError: function(evt) {
				console.log('连接错误');
				evt
			},
			onOpen: function(evt) {
				console.log('连接成功');
				evt
			},
			onClose: function(evt) {
				console.log('关闭');
				evt
				this.$notify({
					title: 'Internet Error',
					message: '已断开连接',
					type: 'error',
					duration: 2000
				});
				this.RoomInfo.timelist = []
				this.RoomInfo.templist = []
				this.RoomInfo.moneylist = []
				
				this.$store.commit('PowerModeChange')
				this.$router.push({
					path: '/',
				});
			},
			onMessage: function(evt) {
				console.log('收到消息');
				var message = JSON.parse(evt.data);
				var eve_id = message.event_id;
				
				var data = message.data;
				console.log(">>>>>")
				console.log("event",eve_id)
				console.log(data)
				switch (eve_id) {
					case 1:
						/* 中央空调状态反馈 */
						this.$store.commit('UpdateCenterTemp', data.temp)
						if (data.mode) {
							this.heating_onclick();
						} else {
							this.cooling_coclick();
						}
						break;
					case 3:
						/* 主机送风 */
						if(data.mode != this.SlaveState.mode){
							this.$store.commit('UpdateCenterTemp', data.temp)
							if (data.mode) {
								this.heating_onclick();
							} else {
								this.cooling_coclick();
							}
						}
						var temp_dif = data.temp - this.SlaveState.cur_temp;
						var add_temp = temp_dif * 0.1 * (data.speed + 1) * 0.2;
						// switch(data.speed){
						// 	case
						// }
						// var add_temp = temp_dif * 0.1 * (data.speed + 1);
						if(data.speed == -1){
							return ;
						}
						var add_cost = data.cost;
						this.$store.commit('UpdateRoomInfo', {
							add_temp: add_temp,
							add_cost: add_cost
						})
						break;
					case 6:
						/* 设置从机状态汇报频率 */
						this.$store.commit('UpdateInterval', data.interval)
						clearInterval(this.Timer.timer1);
						
						// this.Timer.timer1 = setInterval(this.send_data, 1000)
						this.Timer.timer1 = setInterval(this.send_data, data.interval)
						
						break;
				}
			},
		},
		beforeDestroy() {
			console.log("destroyed!")
			console.log("EndTimer")
			console.log(this.Timer.timer1)
			clearInterval(this.Timer.timer1)
			
			clearInterval(this.Timer.timer0)
			this.Timer.timer0 = null;
			clearInterval(this.Timer.timer1)
			this.Timer.timer1 = null;
			clearInterval(this.Timer.timer2)
			this.Timer.timer2 = null;
			clearInterval(this.Timer.timer3)
			this.Timer.timer3 = null;
		}
	}
</script>

<style>
	.el-header {
		background-color: #545c64;
		color: #333;
		line-height: 6vh;
	}

	.el-aside {
		color: #333;
	}
	
	.el-main {
		margin-top: 12vh;
	}
</style>
