import React from 'react'
import { render } from '@testing-library/react'
import { useDebounce, executeAt } from './'
import PropTypes from 'prop-types'

const realDateNow = Date.now.bind(global.Date)
jest.useFakeTimers()
const obj = {}
const Debounced = ({ fn, delay, maxWait, executeAt }) => {
  let debounced = useDebounce(fn, delay || 1000, maxWait, executeAt)
  obj.debounced = debounced
  return <></>
}

Debounced.propTypes = {
  fn: PropTypes.func,
  delay: PropTypes.number,
  maxWait: PropTypes.number,
  executeAt: PropTypes.object

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
    obj.debounced(2)
    obj.debounced(3)
    expect(func.mock.calls.length).toBe(2)
    expect(func.mock.calls[0][0]).toEqual(1)
    expect(func.mock.calls[1][0]).toEqual(2)
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
    obj.debounced(2)
    jest.advanceTimersByTime(900)
    advanceDateNowBy(900)
    obj.debounced(3)
    expect(func.mock.calls.length).toBe(1)
  })

  it('function be called with no arguments works', () => {
    const func = jest.fn(x => console.log('Test', x))
    render(<Debounced fn={func} delay={2000} maxWait={1900} />)
    obj.debounced()
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0].length).toBe(0)
  })
  it('function be called with arguments as parameter values not array', () => {
    const func = jest.fn()
    render(<Debounced fn={func} delay={2000} maxWait={1900} />)
    obj.debounced(1)
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0]).toEqual([1])
  })

  it('function be called with arguments as parameter with more then 1 parameter', () => {
    const func = jest.fn()
    render(<Debounced fn={func} delay={2000} maxWait={1900} />)
    obj.debounced(1, 2)
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0]).toEqual([1, 2])
  })
  it('function should be executed with parameters of last call if executeAt.end is passed', () => {
    const func = jest.fn(x => console.log('Test', x))
    render(<Debounced fn={func} delay={2000} maxWait={1900} executeAt={executeAt.end} />)
    obj.debounced(1)
    obj.debounced(2)
    obj.debounced(3)
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0][0]).toBe(3)
  })
  it('function should be executed with parameters of first and last calls if executeAt.both is passed', () => {
    const func = jest.fn(x => console.log('Test', x))
    render(<Debounced fn={func} delay={2000} maxWait={1900} executeAt={executeAt.both} />)
    obj.debounced(1)
    obj.debounced(2)
    obj.debounced(3)
    expect(func.mock.calls.length).toBe(2)
    expect(func.mock.calls[0][0]).toBe(1)
    expect(func.mock.calls[1][0]).toBe(3)
  })
})
