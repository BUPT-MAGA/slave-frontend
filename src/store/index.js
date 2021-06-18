import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


export default new Vuex.Store({
	state: {
		SlaveState: {
			room_id: "101",
			user_id: "",
			cur_temp: 30,
			tar_temp: 26,
			room_temp: 30,
			center_air_temp: 20,
			mode: 0,
			cost: 0,
			speed: 0,
			interval: 0,
			power_mode: 1,
			use_time: 0,
			mode_src: require("@/assets/images/snow.png"),
			speed_str: '送风中'
		},
		ws: null,
	},
	mutations: {
		TempAdd: state => state.SlaveState.tar_temp += 1,
		TempSub: state => state.SlaveState.tar_temp -= 1,
		PowerModeChange: state => state.SlaveState.power_mode = 0,
		UpdateUseTime(state, time) {
			state.SlaveState.use_time = state.SlaveState.use_time + time
		},
		UpdateUserInfo(state, userInfo) {
			state.SlaveState.user_id = userInfo.user_id
			state.SlaveState.room_id = userInfo.room_id
		},
		UpdateWs(state, ws) {
			state.ws = ws
		},
		UpdateRoomInfo(state, data) {
			state.SlaveState.cur_temp += data.add_temp
			if (data.add_cost != 0) state.SlaveState.cost = data.add_cost
		},
		UpdateCenterTemp(state, temp) {
			state.SlaveState.center_air_temp = temp
		},
		UpdateInterval(state, interval) {
			state.SlaveState.interval = interval
		},
		UpdateMode(state, mode) {
			state.SlaveState.mode = mode
			if (mode == 0) {
				state.SlaveState.mode_src = require("@/assets/images/snow.png")
			} else {
				state.SlaveState.mode_src = require("@/assets/images/sun.png")
			}
		},
		UpdateRoomTemp(state, temp) {
			state.SlaveState.room_temp = temp
		},
		UpdateSpeedStr(state, hasWind){
			if(hasWind){
				state.SlaveState.speed_str = '送风中'
			}else{
				state.SlaveState.speed_str = '未送风'
			}
		}
	}
})
