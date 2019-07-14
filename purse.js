/// # purse.js
console.debug('# purse.js')
// needs: user-file-buttons.js

/// a wrapper around accessing localStorage
class Purse extends EventTarget {
	/// create the wrapper to access the localStorage key @name
	constructor(name) {
		super()
		this.name = name
		this.data = null
		this.load(true)
	}
	
	/// load JSON object into this.store
	load(force = false) {
		if (force || this.dirty) {
			this.data = JSON.parse(localStorage.getItem(this.name))
			this.dirty = false
			// TODO: output 'loaded' event
			this.dispatchEvent(new Event('loaded'))
		}
	}
	/// persist this.store
	save(force = false) {
		if (force || this.dirty) {
			localStorage.setItem(this.name, JSON.stringify(this.data))
		}
		this.load()
	}
	
	/// create an import button to load data into this purse
	make_import_button() {
		const purse = this
		const self = make_import_element()
		self.picker.setAttribute('accept', '.json')
		self.picker.addEventListener('change', async function (ev) {
			console.warn('importing', this.files, 'into Purse', purse)
			purse.data = await this.files[0].json()
			purse.dirty = true
			purse.save()
			// output 'imporded' event
			purse.dispatchEvent(new Event('imported'))
		})
		return self
	}
	
	/// create an export button for downloading the purse to be imported later
	make_export_button() {
		const purse = this
		const self = make_export_element(true)
		self.addEventListener('export', function (ev) {
			console.warn('exporting', purse.data) 
			self.attach_file('data.json', purse.data)
		})
		// output 'exported' event when the element does
		self.addEventListener('exported', _ => purse.dispatchEvent('exported'))
		return self
	}
}
