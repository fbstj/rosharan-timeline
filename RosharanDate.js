///# tools for dealing with Rosharan style YYYY.M.W.D dates
console.debug('# RosharanDate.js')

/// a class for dealing with Rosharan dates
class RosharanDate {
	// create an immutable date object that can be formatted etc
	constructor(year, month, week, day) {
		// store year
		this.year = +year
		/// assert that @value is a valid @context
		function check_range(value, max, context) {
			if (value === undefined) return undefined
			console.assert(
				0 < value && value <= max,
				context, 'argument out of range:', value
			)
			return (0 < value && value <= max) ? +value : false
		}
		// check and store other parts
		this.month = check_range(month, 10, '@month')
		this.week = check_range(week, 10, '@week')
		this.day = check_range(day, 5, '@day')
		/// freeze to make immutable
		Object.freeze(this)
	}
	
	/// the specificity of this date
	get kind() {
		if (0 < this.day   && this.day   <= 5 ) return 'day'
		if (0 < this.week  && this.week  <= 10) return 'week'
		if (0 < this.month && this.month <= 10) return 'month'
		return 'year'
	}
	
	/// format @month/@week/@day into a textual representation
	get vorin_name() {
		const month_parts = ['','Jes', 'Nan', 'Chach', 'Vev', 'Palah', 'Shash', 'Betab', 'Kak', 'Tanat', 'Ish'+(this.week?'':'i')]
		const week_parts =  ['', 'es',  'an',   'ach',  'ah',    'ah',   'ash',    'ab',  'ak',    'at', 'ish'+(this.day?'':'i')]
		const day_parts =   ['', 'es',  'an',   'ach',  'ev',    'ah']
		return month_parts[this.month||0] + week_parts[this.week||0] + day_parts[this.day||0]
	}
	
	/// format as YYYY.M.W.D
	get date_format() {
		return [this.year, this.month, this.week, this.day].filter(a => !!a).join('.')
	}
	
	/// iterate over all days in the current date kind
	all_days() {
		const DAYS = [1,2,3,4,5]
		const WEEKS = [1,2,3,4,5,6,7,8,9,10]
		const MONTHS = [1,2,3,4,5,6,7,8,9,10]
		if (this.kind === 'day') { return [this] }
		if (this.kind === 'week') {
			const [Y,M,W] = [this.year, this.month, this.week]
			return DAYS.map(day => new RosharanDate(Y, M, W, day))
		}
		if (this.kind === 'month') {
			const [Y,M] = [this.year, this.month]
			return WEEKS.flatMap(week => new RosharanDate(Y, M, week).all_days())
		}
		if (this.kind === 'year') {
			const Y = this.year
			return MONTHS.flatMap(month => new RosharanDate(Y, month).all_days())
		}
		console.error('unsupported kind:', this.kind)
	}

	/// attempt to create a date from a YYYY.M.W.D formatted string
	static from_string(text) {
		return new RosharanDate(...(''+ text).split('.'))
	}

	/// adds an @offset of @kind to the given Rosharan date, respecting
	/// Rosharan date wrapping rules. Kind is: { day, week, month, year }
	add(offset, kind = 'day') {
		/// perform `@b += @o mod @max` and add the number of overflows into @a
		/// - accepts negative @a, @b, @o
		/// - ensures 0 < @b <= @max since 0 is an invalid day/week/month number
		function distribute(a,b,o,max) {
			let [A,B] = [a, b + o]
			// TODO: remove loops
			while (B < 1)   [A,B] = [A - 1, B + max]
			while (B > max) [A,B] = [A + 1, B - max]
			return [A,B]
		}
		// add @offset years to the date
		if (kind === 'year') {
			return new RosharanDate(
				this.year + offset,
				this.month || undefined,
				this.week || undefined,
				this.day || undefined,
				)
		}
		// add @offset months to the date
		if (kind === 'month') {
			if (this.month === false) console.warn('assuming @month is 1')
			let [Y,M] = distribute(this.year, this.month || 1, offset, 10)
			return new RosharanDate(
				Y, M,
				this.week || undefined,
				this.day || undefined,
				)
		}
		// add @offset weeks to the date
		if (kind === 'week') {
			if (this.month === false) console.warn('assuming @month is 1')
			if (this.week === false) console.warn('assuming @week is 1')
			let [M,W] = distribute(this.month || 1, this.week || 1, offset, 10)
			let [Y,MM] = distribute(this.year, M, 0, 10)
			return new RosharanDate(
				Y, MM, W,
				this.day || undefined,
				)
		}
		// add @offset days to the date
		if (kind === 'day') {
			if (this.week === false) console.warn('assuming @week is 1')
			if (this.day === false) console.warn('assuming @day is 1')
			let [W,D] = distribute(this.week || 1, this.day || 1, offset, 5)
			let [M,WW] = distribute(this.month, W, 0, 10)
			let [Y,MM] = distribute(this.year, M, 0, 10)
			return new RosharanDate(Y, MM, WW, D)
		}
		console.error('unsupported kind:', kind)
		return this
	}
}
