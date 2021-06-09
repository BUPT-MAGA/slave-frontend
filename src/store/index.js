import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// const defaultName = 'Jason';
// const defaultUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
// const defaultTemperature = 22
// const defaultFrequence = 1000
// const defaultRoomNo = '101'
// const defaultASstate = '待机'
// const defaultWind = 0
// const defaultTotalMoney = 0
// const defaultUseTime = 0
// const defaultState = '制冷'
// const defaultSlaveTemp = 27
// const defaultError = 0
// const MAXTemp = 31
// const defaultTotalEnergy = 0
// const defaultMode = 50

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
			use_time: 0
		}
	},
	mutations: {
		TempAdd: state => state.SlaveState.tar_temp += 1,
		TempSub: state => state.SlaveState.tar_temp -= 1,
		PowerModeChange: state => state.SlaveState.power_mode = 0,
		UpdateUseTime(state, time){
			state.SlaveState.use_time = state.SlaveState.use_time + time;
		},
		UpdateUserInfo(state, userInfo){
			state.SlaveState.user_id = userInfo.user_id
			state.SlaveState.room_id = userInfo.room_id
		}
		// Login(state, UserInfo) {
		// 	state.UserInfo.name = UserInfo.userName
		// 	state.UserInfo.avaterUrl = UserInfo.avaterUrl
		// 	state.UserInfo.token = UserInfo.token
		// 	state.SlaveState.Basic.RoomNo = UserInfo.roomNo
		// },
		// Logout(state) {
		// 	state.UserInfo.name = defaultName
		// 	state.UserInfo.avaterUrl = defaultUrl
		// },
		// SetSlaveState(state, SlaveInfo) {
		// 	var wind = 0
		// 	switch (SlaveInfo.slave.wind) {
		// 		case 'LOW':
		// 			wind = 0
		// 			break;
		// 		case 'MID':
		// 			wind = 50
		// 			break;
		// 		case 'HIGH':
		// 			wind = 100
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// 	state.SlaveState.Settings.SetWind = wind
		// 	state.SlaveState.Settings.SetTemperature = SlaveInfo.slave.targetT
		// 	state.SlaveState.Basic.Temperature = SlaveInfo.temperature
		// 	state.SlaveState.Basic.TotalMoney = SlaveInfo.slave.prevPrice
		// 	state.SlaveState.Basic.TotalEnergy = SlaveInfo.slave.prevP
		// },
		// UpdateASstate(state, ASstate) {
		// 	state.SlaveState.Basic.ASstate = ASstate
		// },
		// UpdateSlaveSettings(state, SettingInfo) {
		// 	state.SlaveState.Settings.SetTemperature = SettingInfo.Temp
		// 	state.SlaveState.Settings.SetWind = SettingInfo.Wind
		// },
		// UpdateSlaveTime(state, time) {
		// 	state.SlaveState.Basic.UseTime = time + state.SlaveState.Basic.UseTime
		// },
		// UpdateSlaveTemp(state, temp) {
		// 	if (temp <= MAXTemp) state.SlaveState.Basic.Temperature = temp
		// 	else state.SlaveState.Basic.Temperature = MAXTemp
		// },
		// UpdateSlaveTotal(state, info) {
		// 	console.log('infsds: ' + info.cost)
		// 	state.SlaveState.Basic.TotalMoney = info.cost
		// 	state.SlaveState.Basic.TotalEnergy = info.P
		// },
		// UpdateSlaveError(state, error) {
		// 	state.SlaveState.Error = error
		// }
	}
})
