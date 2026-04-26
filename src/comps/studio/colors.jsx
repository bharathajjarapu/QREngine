
export function Colors({ fields, setField, setFields }) {
  const bgMode = fields.qrBg === 'transparent' ? 'transparent' : fields.qrBgStyle
  const setBg = (next) => {
    if (next === 'transparent') {
      setField('qrBg', 'transparent')
    } else {
      setFields((s) => ({
        ...s,
        qrBgStyle: next,
        qrBg: s.qrBg === 'transparent' ? '#ffffff' : s.qrBg,
      }))
    }
  }

  return (
    <div className="grid gap-4">
      <div className="min-w-0 grid gap-2">
        <span className="qn-heading">Foreground color</span>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2" role="group" aria-label="Foreground fill style">
          {[
            ['solid', 'Solid', 'Solid fill'],
            ['linear', 'Linear', 'Linear gradient'],
            ['radial', 'Radial', 'Radial gradient'],
          ].map(([value, short, full]) => {
            const on = fields.qrFgStyle === value
            return (
              <button
                key={value}
                type="button"
                title={full}
                onClick={() => setField('qrFgStyle', value)}
                className={`qn-opt min-h-0 py-2.5 sm:min-h-[3.1rem] sm:py-2.5 ${on ? 'qn-opt--on' : 'qn-opt--off'}`}
                aria-pressed={on}
              >
                <span className="text-center text-xs font-semibold leading-tight sm:text-sm">{short}</span>
              </button>
            )
          })}
        </div>
        {fields.qrFgStyle === 'solid' ? (
          <div className="flex min-w-0 items-center gap-2">
            <input
              type="color"
              className="qn-swatch"
              value={/^#[0-9a-f]{6}$/i.test(String(fields.qrFg)) ? fields.qrFg : '#111827'}
              onChange={(e) => setField('qrFg', e.target.value)}
              aria-label="Primary foreground color"
            />
            <input
              className={`qn-input min-w-0 flex-1 font-mono text-sm`}
              value={fields.qrFg}
              onChange={(e) => setField('qrFg', e.target.value)}
              aria-label="Primary foreground color hex"
            />
          </div>
        ) : null}
        {fields.qrFgStyle === 'linear' ? (
          <div className="flex min-w-0 flex-wrap items-end gap-x-2 gap-y-2 sm:gap-x-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color A">
                A
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrFg)) ? fields.qrFg : '#111827'}
                onChange={(e) => setField('qrFg', e.target.value)}
                aria-label="Primary foreground color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrFg}
                onChange={(e) => setField('qrFg', e.target.value)}
                aria-label="Primary foreground color hex"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color B">
                B
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrFgColor2)) ? fields.qrFgColor2 : '#6366f1'}
                onChange={(e) => setField('qrFgColor2', e.target.value)}
                aria-label="Secondary foreground color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrFgColor2}
                onChange={(e) => setField('qrFgColor2', e.target.value)}
                aria-label="Secondary foreground color hex"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <input
                className={`qn-input w-16 min-w-0 font-mono text-sm`}
                type="number"
                min={0}
                max={360}
                value={fields.qrFgAngle}
                onChange={(e) => setField('qrFgAngle', e.target.value)}
                aria-label="Foreground linear gradient angle in degrees"
              />
            </div>
          </div>
        ) : null}
        {fields.qrFgStyle === 'radial' ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color A">
                A
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrFg)) ? fields.qrFg : '#111827'}
                onChange={(e) => setField('qrFg', e.target.value)}
                aria-label="Primary foreground color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrFg}
                onChange={(e) => setField('qrFg', e.target.value)}
                aria-label="Primary foreground color hex"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color B">
                B
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrFgColor2)) ? fields.qrFgColor2 : '#6366f1'}
                onChange={(e) => setField('qrFgColor2', e.target.value)}
                aria-label="Secondary foreground color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrFgColor2}
                onChange={(e) => setField('qrFgColor2', e.target.value)}
                aria-label="Secondary foreground color hex"
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className="min-w-0 grid gap-2">
        <span className="qn-heading">Background color</span>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2" role="group" aria-label="Background fill style">
          {[
            ['solid', 'Solid', 'Solid fill'],
            ['linear', 'Linear', 'Linear gradient'],
            ['radial', 'Radial', 'Radial gradient'],
            ['transparent', 'Clear', 'Transparent (no fill)'],
          ].map(([value, short, full]) => {
            const on = bgMode === value
            return (
              <button
                key={value}
                type="button"
                title={full}
                onClick={() => setBg(value)}
                className={`qn-opt min-h-0 py-2.5 sm:min-h-[3.1rem] sm:py-2.5 ${on ? 'qn-opt--on' : 'qn-opt--off'}`}
                aria-pressed={on}
              >
                <span className="text-center text-xs font-semibold leading-tight sm:text-sm">{short}</span>
              </button>
            )
          })}
        </div>
        {bgMode !== 'transparent' && fields.qrBg !== 'transparent' ? (
          fields.qrBgStyle === 'solid' ? (
            <div className="flex min-w-0 items-center gap-2">
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrBg)) ? fields.qrBg : '#ffffff'}
                onChange={(e) => setField('qrBg', e.target.value)}
                aria-label="Primary background color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrBg}
                onChange={(e) => setField('qrBg', e.target.value)}
                aria-label="Primary background color hex"
              />
            </div>
          ) : null
        ) : null}
        {bgMode !== 'transparent' && fields.qrBg !== 'transparent' && fields.qrBgStyle === 'linear' ? (
          <div className="flex min-w-0 flex-wrap items-end gap-x-2 gap-y-2 sm:gap-x-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color A">
                A
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrBg)) ? fields.qrBg : '#ffffff'}
                onChange={(e) => setField('qrBg', e.target.value)}
                aria-label="Primary background color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrBg}
                onChange={(e) => setField('qrBg', e.target.value)}
                aria-label="Primary background color hex"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color B">
                B
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrBgColor2)) ? fields.qrBgColor2 : '#e5e7eb'}
                onChange={(e) => setField('qrBgColor2', e.target.value)}
                aria-label="Secondary background color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrBgColor2}
                onChange={(e) => setField('qrBgColor2', e.target.value)}
                aria-label="Secondary background color hex"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <input
                className={`qn-input w-16 min-w-0 font-mono text-sm`}
                type="number"
                min={0}
                max={360}
                value={fields.qrBgAngle}
                onChange={(e) => setField('qrBgAngle', e.target.value)}
                aria-label="Background linear gradient angle in degrees"
              />
            </div>
          </div>
        ) : null}
        {bgMode !== 'transparent' && fields.qrBg !== 'transparent' && fields.qrBgStyle === 'radial' ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color A">
                A
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrBg)) ? fields.qrBg : '#ffffff'}
                onChange={(e) => setField('qrBg', e.target.value)}
                aria-label="Primary background color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrBg}
                onChange={(e) => setField('qrBg', e.target.value)}
                aria-label="Primary background color hex"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 [min-width:10rem]">
              <span className="w-5 shrink-0 text-xs font-semibold text-qn-muted" title="Color B">
                B
              </span>
              <input
                type="color"
                className="qn-swatch"
                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrBgColor2)) ? fields.qrBgColor2 : '#e5e7eb'}
                onChange={(e) => setField('qrBgColor2', e.target.value)}
                aria-label="Secondary background color"
              />
              <input
                className={`qn-input min-w-0 flex-1 font-mono text-sm`}
                value={fields.qrBgColor2}
                onChange={(e) => setField('qrBgColor2', e.target.value)}
                aria-label="Secondary background color hex"
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        <label className="grid min-w-0 gap-1">
          <span className="qn-heading">Outer corner color</span>
          <span className="flex min-w-0 items-center gap-2">
            <input
              type="color"
              className="qn-swatch"
              value={/^#[0-9a-f]{6}$/i.test(String(fields.qrCornerOuterColor)) ? fields.qrCornerOuterColor : '#111827'}
              onChange={(e) => setField('qrCornerOuterColor', e.target.value)}
              aria-label="Outer corner color picker"
            />
            <input
              className={`qn-input min-w-0 font-mono text-sm`}
              value={fields.qrCornerOuterColor}
              onChange={(e) => setField('qrCornerOuterColor', e.target.value)}
              aria-label="Outer corner color hex"
            />
          </span>
        </label>
        <label className="grid min-w-0 gap-1">
          <span className="qn-heading">Inner corner color</span>
          <span className="flex min-w-0 items-center gap-2">
            <input
              type="color"
              className="qn-swatch"
              value={/^#[0-9a-f]{6}$/i.test(String(fields.qrCornerInnerColor)) ? fields.qrCornerInnerColor : '#111827'}
              onChange={(e) => setField('qrCornerInnerColor', e.target.value)}
              aria-label="Inner corner color picker"
            />
            <input
              className={`qn-input min-w-0 font-mono text-sm`}
              value={fields.qrCornerInnerColor}
              onChange={(e) => setField('qrCornerInnerColor', e.target.value)}
              aria-label="Inner corner color hex"
            />
          </span>
        </label>
      </div>
    </div>
  )
}
