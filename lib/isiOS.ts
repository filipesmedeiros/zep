const isiOS = () => {
  if ('userAgent' in navigator)
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.userAgent)
  else {
    // not implemented yet, but put it here just for fun
    // @ts-expect-error
    return navigator.userAgentData.platform === 'iOS'
  }
}

export default isiOS
