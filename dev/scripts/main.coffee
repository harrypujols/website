console.log "Hello from the console!"

$('pre code').each (i, block) ->
    hljs.highlightBlock block
    return
