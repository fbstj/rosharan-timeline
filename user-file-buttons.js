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

/// creates the button which opens the file exporter
function make_export_element() {
	let gen_data = () => console.error('export:', 'no file loader');
	// build save file clicker
	const link = document.createElement('a')
	link.download = 'export.json'
	// build picker open button
	const button = document.createElement('button')
	button.innerText = 'export'
	button.addEventListener('click', _ => { link.click() })
	button.disabled = true
	// build wrapper element
	const self = document.createElement('label')
	self.classList.add('exporter')
	self.append(button, link)
	/// set up the url for downloading 
	self.setup = function(name, data) {
		const file = new Blob([ JSON.stringify(data) ])
		window.URL.revokeObjectURL(link.href)
		link.download = name
		link.href = window.URL.createObjectURL(file)
		button.disabled = false
	}
	// helper accessors
	return Object.freeze(self)
}
