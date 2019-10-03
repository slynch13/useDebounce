import React from 'react'
import { render } from '@testing-library/react'
import { useDebounce } from './'
import PropTypes from 'prop-types'

const realDateNow = Date.now.bind(global.Date)
jest.useFakeTimers()
const obj = {}
const Debounced = ({ fn, delay, maxWait }) => {
  let debounced = useDebounce(fn, delay || 1000, maxWait)
  obj.debounced = debounced
  return <></>
}

Debounced.propTypes = {
  fn: PropTypes.func,
  delay: PropTypes.number,
  maxWait: PropTypes.number
}

beforeEach(() => {
  const dateNowStub = jest.fn(() => 1530518207007)
  global.Date.now = dateNowStub
})
const advanceDateNowBy = (ms) => {
  let now = global.Date.now()
  const dateNowStub = jest.fn(() => now + ms)
  global.Date.now = dateNowStub
}
afterEach(() => {
  global.Date.now = realDateNow
})
describe('useDebounce', () => {
  it('is truthy', () => {
    expect(useDebounce).toBeTruthy()
  })

  it('date is mocked', () => {
    expect(Date.now()).toBe(1530518207007)
  })

  it('should not call twice', () => {
    const func = jest.fn()
    render(<Debounced fn={func} />)
    obj.debounced(1)
    obj.debounced(1)
    expect(func.mock.calls.length).toBe(1)
  })

  it('should be call twice if interval is finished ', () => {
    const func = jest.fn()
    render(<Debounced fn={func} />)
    obj.debounced(1)
    jest.advanceTimersByTime(1000)
    obj.debounced(1)
    obj.debounced(1)
    expect(func.mock.calls.length).toBe(2)
  })

  it('function should not be called called multiple times within limit', () => {
    const func = jest.fn()
    render(<Debounced fn={func} />)
    obj.debounced(1)
    jest.advanceTimersByTime(900)
    obj.debounced(1)
    jest.advanceTimersByTime(900)
    obj.debounced(1)
    expect(func.mock.calls.length).toBe(1)
  })

  it('function should be called if max wait time has passed', () => {
    const func = jest.fn()
    render(<Debounced fn={func} delay={2000} maxWait={1000} />)
    obj.debounced(1)
    jest.advanceTimersByTime(900)
    advanceDateNowBy(900)
    obj.debounced(1)
    jest.advanceTimersByTime(900)
    advanceDateNowBy(900)
    obj.debounced(1)
    expect(func.mock.calls.length).toBe(2)
  })

  it('function should not be called if max wait time has not passed', () => {
    const func = jest.fn()
    render(<Debounced fn={func} delay={2000} maxWait={1900} />)
    obj.debounced(1)
    jest.advanceTimersByTime(900)
    advanceDateNowBy(900)
    obj.debounced(1)
    jest.advanceTimersByTime(900)
    advanceDateNowBy(900)
    obj.debounced(1)
    expect(func.mock.calls.length).toBe(1)
  })
})