const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const http = require('http')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'DMP IP Address or hostname',
				width: 8,
				//regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'DMP Port Number',
				width: 4,
				default: '4502',
				regex: Regex.PORT,
			},
			{
				type: 'textinput',
				id: 'default_path',
				label: 'Default Path of files stored on DMP.',
				tooltip: 'i.e. C:\\Data\\  (If left blank, specify the whole path on each button instance)',
				width: 12,
				default: '',
			},
			{
				type: 'textinput',
				id: 'default_sign_id',
				label: 'Default Zone ID on DMP.',
				tooltip: 'i.e. 264x480:primary/fullscreen  (If left blank, specify the zone id on each button instance)',
				width: 8,
				default: '',
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	executeAction = (action) => {
		let opt = action.options
		let fb = 0

		if (opt.fb !== undefined) {
			fb = opt.fb - 1
		}

		var self = this
		var url = 'http://' + self.config.host + ':' + self.config.port
		var sign_id = action.options.sign_id
		if (!sign_id) {
			sign_id = self.config.default_sign_id
		}

		// Create the request
		var envelope_header =
			'<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header><h:PlayControlOperationHeader xmlns:h="http://standards.daktronics.com/schemas/playerservices/playercontrol_1_0.wsdl" xmlns="http://standards.daktronics.com/schemas/playerservices/playercontrol_1_0.wsdl" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"/></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
		var envelope_footer = '</s:Body></s:Envelope>'

		switch (action.actionId) {
			case 'play_file':

				// If the absolute path and filename is set, then use it, otherwise use the relative path and filename.
				if (action.options.file_name) {
					var unique_file_name = action.options.file_name
				} else {
					var unique_file_name = self.config.default_path + action.options.relative_name
				}

				// Play Mode
				if (action.options.play_mode == '0') {
					var play_mode = 'OneTime'
				} else if (action.options.play_mode == '1') {
					var play_mode = 'Continuous'
				} else {
					var play_mode = 'Continuous'
				}

				// for adding double backslashes in the filepath and filename
				let regex = /\\/g

				var body =
					envelope_header +
					'<Play xmlns="http://standards.daktronics.com/schemas/playerservices/playercontrol_1_0.wsdl"><sign><Mode>Name</Mode><SignId>' +
					sign_id +
					'</SignId></sign><options><File><Mode>UniqueFilename</Mode><UniqueFilename>' +
					unique_file_name.replace(regex, '\\\\') +
					'</UniqueFilename></File><PlayMode>' + play_mode + '</PlayMode></options></Play>' +
					envelope_footer

				this.log('info', 'Playing File: ' + unique_file_name + ' on sign id: ' + sign_id)

				break

			case 'blank_display':

				var body =
					envelope_header +
					'<Blank xmlns="http://standards.daktronics.com/schemas/playerservices/playercontrol_1_0.wsdl"><sign><Mode>Name</Mode><SignId>' +
					sign_id +
					'</SignId></sign></Blank>' +
					envelope_footer

				this.log('info', 'Blanking Display: ' + sign_id)

				break

		}

		// Compile the http request to be made
		var requestData = {
			host: self.config.host,
			path: '/PlayerControl.asmx',
			port: self.config.port,
			method: 'POST',
			headers: {
				'Content-Type': 'text/xml',
				SOAPAction: 'http://standards.daktronics.com/schemas/playerservices/playercontrol/1_0/Play',
				'Content-Length': Buffer.byteLength(body),
			},
		}

		var buffer = ''

		// Make the HTTP request
		var req = http.request(requestData, function (res) {
			console.log(res.statusCode)
			var buffer = ''
			res.on('data', function (data) {
				buffer = buffer + data
			})
			res.on('end', function (data) {
				console.log(buffer)
			})
		})

		req.on('error', function (e) {
			console.log('Problem with request: ' + e.message)
		})

		req.write(body)
		req.end()
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
