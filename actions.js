module.exports = function (self) {
	self.setActionDefinitions({
		play_file: {
			name: 'Plays a certain file',
			options: [
				{
					type: 'textinput',
					label: 'Absolute Filepath and filename. Will over ride relative path if set.',
					id: 'file_name',
				},
				{
					type: 'textinput',
					label: 'Relative Filepath and filename. Assumes a default path is set in connection settings.',
					id: 'relative_name',
				},
				{
					type: 'textinput',
					label: 'Zone ID (leave blank to use default set in connection settings)',
					id: 'sign_id',
				},
			],
			callback: async (event) => {
				console.log('sending play_file command')
				self.executeAction(event)
			},
		},
		blank_display: {
			name: 'Blank Display',
			options: [
				{
					type: 'textinput',
					label: 'Zone ID (leave blank to use default set in settings)',
					id: 'sign_id',
				},
			],
			callback: async (event) => {
				console.log('sending blank_display command')
				self.executeAction(event)
			},
		},
	})
}
