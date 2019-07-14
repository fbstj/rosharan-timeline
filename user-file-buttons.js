///# import and export buttons
console.debug('# user-file-buttons.js')

/// creates the file-dialog opening button
function make_import_element() {
	// build file picker element
	const input = document.createElement('input')
	input.setAttribute('type', 'file')
	input.style.width = 0
	// build picker open button
	const button = document.createElement('button')
	button.innerText = 'import'
	button.addEventListener('click', _ => input.click())
	// build wrapper element
	const self = document.createElement('label')
	self.classList.add('importer')
	self.append(button, input)
	// helper accessors
	self.clicker = button
	self.picker = input
	return Object.freeze(self)
}

/// return a promise which wraps the FileReader stuff
function read_text_file(file) { return new Promise((resolve, reject) => {
	// file reader junk
	const reader = new FileReader
	reader.onload = function (ev) { resolve(reader.result) }
	try {
		reader.readAsText(file)
	} catch(e) {
		reject(e)
	}
})}
/// attach a read_text_file 
File.prototype.text = function() { return read_text_file(this) }
File.prototype.json = function() { return this.text().then(txt => JSON.parse(txt)) }

/// creates the button which saves generated files
/// * when @is_async is true, clicking the button generates an 'export' event
/// * the 'export' event should call `attach_file` with the generated data
/// * when @is_async is false, the button should be disabled before `attach_file` is called
function make_export_element(is_async = false) {
	// build save file clicker
	const link = document.createElement('a')
	link.download = 'export.json'
	// build picker open button
	const button = document.createElement('button')
	button.innerText = 'export'
	// build wrapper element
	const self = document.createElement('label')
	self.classList.add('exporter')
	self.append(button, link)
	/// set up the url for downloading 
	self.attach_file = function(name, data) {
		const file = new Blob([ JSON.stringify(data) ], { type: 'application/json', })
		window.URL.revokeObjectURL(link.href)
		link.download = name
		link.href = window.URL.createObjectURL(file)
		button.disabled = false
	}
	// chose between sync & async modes
	if (is_async) {
		self.setAttribute('async','')
	} else {
		button.disabled = true
	}
	// setup button click handler
	button.addEventListener('click', function(ev) {
		// configured to be async so execute the export handler
		if (self.hasAttribute('async')) {
			// NOTE: this handler should call self.attach_file()
			self.dispatchEvent(new Event('export'))
			// TODO: check this happens sync & before generated click
		}
		if (!link.href) {
			console.warn('nothing to download')
		} else {
			link.click()
			self.dispatchEvent(new Event('exported'))
		}
	})
	// helper accessors
	return Object.freeze(self)
}
