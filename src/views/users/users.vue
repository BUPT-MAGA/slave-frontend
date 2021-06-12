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
				<img style="left:10px;width: 9%" src='../../assets/maga.png' />
				<img style="margin:0 25%;width: 15%" src='../../assets/maga.png' />
				<el-popover style="margin:0 1%" trigger="click">
					<div>
						<img style="margin:0 50%;width: 30%" src='../../assets/logo.png' />
					</div>
					<el-button slot="reference" type="primary" round>立即付款</el-button>
				</el-popover>
				<el-button style="margin:0 1%" type="primary" round @click="power_onclick()">关机</el-button>
				<!-- TODO -->
				<!-- <span>{{Customer.name}}</span> -->
			</el-header>

			<el-main>
				<!-- <sensor ref="sensor"></sensor> -->

				<div v-show="show_setting">
					<!-- <setting ref="set"></setting> -->

					<h3>{{PowerMode}}</h3>
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
				RoomInfo: {
					timelist: [],
					templist: [],
					moneylist: []
				},
				Timer: {
					timer0: null,
					timer1: null
				}
			}
		},
		mounted() {
			this.Timer.timer0 = setInterval(this.getlist, 5000)
			this.Timer.timer1 = setInterval(this.send_data, 1000)
			this.Timer.timer2 = setInterval(this.tempNatualAdd, 500)
			// this.ws.onerror = this.onError(event)
			// this.ws.onclose = this.onClose(event)
			// this.ws.onmessage = this.onMessage(event)
			// this.ws.onopen = this.onOpen(event)
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
			/**
			 * init() 初始化
			 */
			init() {
				this.sendOnReq()
				this.RoomInfo.timelist.push(0)
				this.RoomInfo.templist.push(this.SlaveState.tar_temp)
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
				var add_temp = temp_dif * 0.01;
				var add_cost = 0;
				this.$store.commit('UpdateRoomInfo', {
					add_temp: add_temp,
					add_cost: add_cost
				})
			},

			power_onclick() {
				if (this.PowerMode) {
					this.$notify({
						title: 'Speed',
						message: '已关机',
						type: 'success',
						duration: 2000
					});
					this.ws.close()
					this.RoomInfo.timelist = []
					this.RoomInfo.templist = []
					this.RoomInfo.moneylist = []
					this.$store.commit('PowerModeChange')
					this.$router.push({
						path: '/',
					});
					
				}
			},
			send_data() {
				console.log("send_data");
				this.ws.send(JSON.stringify({
					event_id: 7,
					data: {
						cur_temp: this.SlaveState.cur_temp,
						tar_temp: this.SlaveState.tar_temp,
						mode: this.SlaveState.mode,
						speed: this.SlaveState.speed
					}
				}))
			},
			onError: function(evt) {
				alert('连接失败');
				evt
			},
			onOpen: function(evt) {
				alert('连接成功');
				evt
			},
			onClose: function(evt) {
				clearInterval(this.data_timer);
				alert('关闭');
				evt
			},
			onMessage: function(evt) {
				alert('收到消息');
				evt
				var message = JSON.parse(evt.data);
				var eve_id = message.event_id;
				var data = message.data;
				switch (eve_id) {
					case 1:
						/* 中央空调状态反馈 */
						this.room_data.center_air_temp = data.temp;
						if (data.mode) {
							this.heating_onclick();
						} else {
							this.cooling_coclick();
						}
						break;
					case 3:
						/* 主机送风 */
						var temp_dif = data.temp - this.SlaveState.cur_temp;
						var add_temp = temp_dif * 0.001 * data.speed;
						var add_cost = data.cost;
						this.$store.commit('UpdateRoomInfo', {
							add_temp: add_temp,
							add_cost: add_cost
						})
						break;
					case 6:
						/* 设置从机状态汇报频率 */
						this.$store.commit('data.interval', data.interval)
						clearInterval(this.timer1);
						this.timer1 = setInterval(this.send_data(), data.interval);
						break;
				}
			},
		},
		beforeDestroy() {
			clearInterval(this.Timer.timer0);
			this.Timer.timer0 = null;
			clearInterval(this.Timer.timer1);
			this.Timer.timer1 = null;
			clearInterval(this.Timer.timer2);
			this.Timer.timer2 = null;

		}
	}
</script>

<style>
</style>
