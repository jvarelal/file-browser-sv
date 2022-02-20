
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.44.2 */

    const file$v = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$q(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$v, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$q.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$q(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$v, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$A($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$A,
    			create_fragment$A,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.44.2 */
    const file$u = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$p(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$p.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$a(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$c(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$c.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$c, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$p(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$u, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$u, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$p(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$z($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    const initialState$7 = {
        current: "",
        backward: [],
        fordward: [],
        itemFocus: null,
    };
    function directoryStore() {
        const { subscribe, set, update } = writable(initialState$7);
        return {
            subscribe,
            setInit: (directory) => update((s) => {
                return (Object.assign(Object.assign({}, s), { current: directory }));
            }),
            setDirectory: (directory = "", itemFocus = null) => update((s) => {
                let elements = s.current.split("/");
                let isBack = directory === s.backward[s.backward.length - 1];
                return (Object.assign(Object.assign({}, s), { backward: !s.current || directory === s.current ? s.backward : [...s.backward, s.current], fordward: [], current: directory, itemFocus: itemFocus ? itemFocus : (isBack ? elements[elements.length - 1] : null) }));
            }),
            backward: () => update((s) => {
                if (s.backward.length > 0) {
                    let newCurrent = s.backward.pop();
                    let elements = s.current.split("/");
                    return (Object.assign(Object.assign({}, s), { backward: [...s.backward], fordward: [...s.fordward, s.current], current: newCurrent, itemFocus: elements[elements.length - 1] }));
                }
                return s;
            }),
            fordward: () => update((s) => {
                if (s.fordward.length > 0) {
                    let newCurrent = s.fordward.pop();
                    return (Object.assign(Object.assign({}, s), { backward: [...s.backward, s.current], fordward: [...s.fordward], current: newCurrent, itemFocus: null }));
                }
                return s;
            }),
            reset: () => set(initialState$7)
        };
    }
    var fileDirectoryStore = directoryStore();

    const IMG_PREVIEW = ['jpg', 'png', 'jpeg', 'svg', 'gif', 'webp'];
    const FILE_AS_TEXT = ['md', 'svelte', 'ts', 'json', 'js', "txt"];
    const EDITABLES = [...FILE_AS_TEXT, "html", 'xml'];
    const FileBrowser$1 = {
        baseUrl: "http://localhost:4000/api",
        secureKey: "fB*",
        regexp: {
            folderName: /^["/?*:|<>\\]/
        },
        localStorageKeys: {
            settings: "fe-settings",
            bookmarks: "fe-bookmarks"
        },
        themes: [
            { value: "", label: "fas fa-adjust" },
            { value: "night-light", label: "far fa-moon" },
            { value: "dark", label: "far fa-sun" },
        ],
        sortOptions: [
            { value: "name", label: "Nombre" },
            { value: "size", label: "Tamaño" },
            { value: "modification", label: "Modificación" },
            { value: "creation", label: "Creación" },
        ],
        groupOptions: [
            { value: "", label: "---" },
            { value: "type", label: "Tipo de archivo" },
            { value: "creation", label: "Fecha Creación" },
            { value: "modification", label: "Fecha Modificación" },
        ],
        previews: {
            scalePreview: ['jpg', 'png', 'jpeg'],
            image: IMG_PREVIEW,
            icons: {
                png: ['dat', 'jar'],
                svg: ['css', 'csv', 'exe', 'html', 'mp3', 'mp4', 'txt', 'doc', 'docx', 'js', 'pdf', 'xlsx', 'zip', 'xml', 'webm', 'json']
            },
            asText: FILE_AS_TEXT
        },
        visor: [...IMG_PREVIEW, ...EDITABLES, 'pdf', 'mp3', 'mp4', 'webm'],
        editables: EDITABLES
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    var _nodeResolve_empty = {};

    var _nodeResolve_empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': _nodeResolve_empty
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(_nodeResolve_empty$1);

    var core = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory();
    	}
    }(commonjsGlobal, function () {

    	/*globals window, global, require*/

    	/**
    	 * CryptoJS core components.
    	 */
    	var CryptoJS = CryptoJS || (function (Math, undefined$1) {

    	    var crypto;

    	    // Native crypto from window (Browser)
    	    if (typeof window !== 'undefined' && window.crypto) {
    	        crypto = window.crypto;
    	    }

    	    // Native crypto in web worker (Browser)
    	    if (typeof self !== 'undefined' && self.crypto) {
    	        crypto = self.crypto;
    	    }

    	    // Native crypto from worker
    	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    	        crypto = globalThis.crypto;
    	    }

    	    // Native (experimental IE 11) crypto from window (Browser)
    	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
    	        crypto = window.msCrypto;
    	    }

    	    // Native crypto from global (NodeJS)
    	    if (!crypto && typeof commonjsGlobal !== 'undefined' && commonjsGlobal.crypto) {
    	        crypto = commonjsGlobal.crypto;
    	    }

    	    // Native crypto import via require (NodeJS)
    	    if (!crypto && typeof commonjsRequire === 'function') {
    	        try {
    	            crypto = require$$0;
    	        } catch (err) {}
    	    }

    	    /*
    	     * Cryptographically secure pseudorandom number generator
    	     *
    	     * As Math.random() is cryptographically not safe to use
    	     */
    	    var cryptoSecureRandomInt = function () {
    	        if (crypto) {
    	            // Use getRandomValues method (Browser)
    	            if (typeof crypto.getRandomValues === 'function') {
    	                try {
    	                    return crypto.getRandomValues(new Uint32Array(1))[0];
    	                } catch (err) {}
    	            }

    	            // Use randomBytes method (NodeJS)
    	            if (typeof crypto.randomBytes === 'function') {
    	                try {
    	                    return crypto.randomBytes(4).readInt32LE();
    	                } catch (err) {}
    	            }
    	        }

    	        throw new Error('Native crypto module could not be used to get secure random number.');
    	    };

    	    /*
    	     * Local polyfill of Object.create

    	     */
    	    var create = Object.create || (function () {
    	        function F() {}

    	        return function (obj) {
    	            var subtype;

    	            F.prototype = obj;

    	            subtype = new F();

    	            F.prototype = null;

    	            return subtype;
    	        };
    	    }());

    	    /**
    	     * CryptoJS namespace.
    	     */
    	    var C = {};

    	    /**
    	     * Library namespace.
    	     */
    	    var C_lib = C.lib = {};

    	    /**
    	     * Base object for prototypal inheritance.
    	     */
    	    var Base = C_lib.Base = (function () {


    	        return {
    	            /**
    	             * Creates a new object that inherits from this object.
    	             *
    	             * @param {Object} overrides Properties to copy into the new object.
    	             *
    	             * @return {Object} The new object.
    	             *
    	             * @static
    	             *
    	             * @example
    	             *
    	             *     var MyType = CryptoJS.lib.Base.extend({
    	             *         field: 'value',
    	             *
    	             *         method: function () {
    	             *         }
    	             *     });
    	             */
    	            extend: function (overrides) {
    	                // Spawn
    	                var subtype = create(this);

    	                // Augment
    	                if (overrides) {
    	                    subtype.mixIn(overrides);
    	                }

    	                // Create default initializer
    	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
    	                    subtype.init = function () {
    	                        subtype.$super.init.apply(this, arguments);
    	                    };
    	                }

    	                // Initializer's prototype is the subtype object
    	                subtype.init.prototype = subtype;

    	                // Reference supertype
    	                subtype.$super = this;

    	                return subtype;
    	            },

    	            /**
    	             * Extends this object and runs the init method.
    	             * Arguments to create() will be passed to init().
    	             *
    	             * @return {Object} The new object.
    	             *
    	             * @static
    	             *
    	             * @example
    	             *
    	             *     var instance = MyType.create();
    	             */
    	            create: function () {
    	                var instance = this.extend();
    	                instance.init.apply(instance, arguments);

    	                return instance;
    	            },

    	            /**
    	             * Initializes a newly created object.
    	             * Override this method to add some logic when your objects are created.
    	             *
    	             * @example
    	             *
    	             *     var MyType = CryptoJS.lib.Base.extend({
    	             *         init: function () {
    	             *             // ...
    	             *         }
    	             *     });
    	             */
    	            init: function () {
    	            },

    	            /**
    	             * Copies properties into this object.
    	             *
    	             * @param {Object} properties The properties to mix in.
    	             *
    	             * @example
    	             *
    	             *     MyType.mixIn({
    	             *         field: 'value'
    	             *     });
    	             */
    	            mixIn: function (properties) {
    	                for (var propertyName in properties) {
    	                    if (properties.hasOwnProperty(propertyName)) {
    	                        this[propertyName] = properties[propertyName];
    	                    }
    	                }

    	                // IE won't copy toString using the loop above
    	                if (properties.hasOwnProperty('toString')) {
    	                    this.toString = properties.toString;
    	                }
    	            },

    	            /**
    	             * Creates a copy of this object.
    	             *
    	             * @return {Object} The clone.
    	             *
    	             * @example
    	             *
    	             *     var clone = instance.clone();
    	             */
    	            clone: function () {
    	                return this.init.prototype.extend(this);
    	            }
    	        };
    	    }());

    	    /**
    	     * An array of 32-bit words.
    	     *
    	     * @property {Array} words The array of 32-bit words.
    	     * @property {number} sigBytes The number of significant bytes in this word array.
    	     */
    	    var WordArray = C_lib.WordArray = Base.extend({
    	        /**
    	         * Initializes a newly created word array.
    	         *
    	         * @param {Array} words (Optional) An array of 32-bit words.
    	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.lib.WordArray.create();
    	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
    	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
    	         */
    	        init: function (words, sigBytes) {
    	            words = this.words = words || [];

    	            if (sigBytes != undefined$1) {
    	                this.sigBytes = sigBytes;
    	            } else {
    	                this.sigBytes = words.length * 4;
    	            }
    	        },

    	        /**
    	         * Converts this word array to a string.
    	         *
    	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
    	         *
    	         * @return {string} The stringified word array.
    	         *
    	         * @example
    	         *
    	         *     var string = wordArray + '';
    	         *     var string = wordArray.toString();
    	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
    	         */
    	        toString: function (encoder) {
    	            return (encoder || Hex).stringify(this);
    	        },

    	        /**
    	         * Concatenates a word array to this word array.
    	         *
    	         * @param {WordArray} wordArray The word array to append.
    	         *
    	         * @return {WordArray} This word array.
    	         *
    	         * @example
    	         *
    	         *     wordArray1.concat(wordArray2);
    	         */
    	        concat: function (wordArray) {
    	            // Shortcuts
    	            var thisWords = this.words;
    	            var thatWords = wordArray.words;
    	            var thisSigBytes = this.sigBytes;
    	            var thatSigBytes = wordArray.sigBytes;

    	            // Clamp excess bits
    	            this.clamp();

    	            // Concat
    	            if (thisSigBytes % 4) {
    	                // Copy one byte at a time
    	                for (var i = 0; i < thatSigBytes; i++) {
    	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
    	                }
    	            } else {
    	                // Copy one word at a time
    	                for (var j = 0; j < thatSigBytes; j += 4) {
    	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
    	                }
    	            }
    	            this.sigBytes += thatSigBytes;

    	            // Chainable
    	            return this;
    	        },

    	        /**
    	         * Removes insignificant bits.
    	         *
    	         * @example
    	         *
    	         *     wordArray.clamp();
    	         */
    	        clamp: function () {
    	            // Shortcuts
    	            var words = this.words;
    	            var sigBytes = this.sigBytes;

    	            // Clamp
    	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
    	            words.length = Math.ceil(sigBytes / 4);
    	        },

    	        /**
    	         * Creates a copy of this word array.
    	         *
    	         * @return {WordArray} The clone.
    	         *
    	         * @example
    	         *
    	         *     var clone = wordArray.clone();
    	         */
    	        clone: function () {
    	            var clone = Base.clone.call(this);
    	            clone.words = this.words.slice(0);

    	            return clone;
    	        },

    	        /**
    	         * Creates a word array filled with random bytes.
    	         *
    	         * @param {number} nBytes The number of random bytes to generate.
    	         *
    	         * @return {WordArray} The random word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
    	         */
    	        random: function (nBytes) {
    	            var words = [];

    	            for (var i = 0; i < nBytes; i += 4) {
    	                words.push(cryptoSecureRandomInt());
    	            }

    	            return new WordArray.init(words, nBytes);
    	        }
    	    });

    	    /**
    	     * Encoder namespace.
    	     */
    	    var C_enc = C.enc = {};

    	    /**
    	     * Hex encoding strategy.
    	     */
    	    var Hex = C_enc.Hex = {
    	        /**
    	         * Converts a word array to a hex string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The hex string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;

    	            // Convert
    	            var hexChars = [];
    	            for (var i = 0; i < sigBytes; i++) {
    	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    	                hexChars.push((bite >>> 4).toString(16));
    	                hexChars.push((bite & 0x0f).toString(16));
    	            }

    	            return hexChars.join('');
    	        },

    	        /**
    	         * Converts a hex string to a word array.
    	         *
    	         * @param {string} hexStr The hex string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
    	         */
    	        parse: function (hexStr) {
    	            // Shortcut
    	            var hexStrLength = hexStr.length;

    	            // Convert
    	            var words = [];
    	            for (var i = 0; i < hexStrLength; i += 2) {
    	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
    	            }

    	            return new WordArray.init(words, hexStrLength / 2);
    	        }
    	    };

    	    /**
    	     * Latin1 encoding strategy.
    	     */
    	    var Latin1 = C_enc.Latin1 = {
    	        /**
    	         * Converts a word array to a Latin1 string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The Latin1 string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;

    	            // Convert
    	            var latin1Chars = [];
    	            for (var i = 0; i < sigBytes; i++) {
    	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    	                latin1Chars.push(String.fromCharCode(bite));
    	            }

    	            return latin1Chars.join('');
    	        },

    	        /**
    	         * Converts a Latin1 string to a word array.
    	         *
    	         * @param {string} latin1Str The Latin1 string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
    	         */
    	        parse: function (latin1Str) {
    	            // Shortcut
    	            var latin1StrLength = latin1Str.length;

    	            // Convert
    	            var words = [];
    	            for (var i = 0; i < latin1StrLength; i++) {
    	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    	            }

    	            return new WordArray.init(words, latin1StrLength);
    	        }
    	    };

    	    /**
    	     * UTF-8 encoding strategy.
    	     */
    	    var Utf8 = C_enc.Utf8 = {
    	        /**
    	         * Converts a word array to a UTF-8 string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The UTF-8 string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            try {
    	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
    	            } catch (e) {
    	                throw new Error('Malformed UTF-8 data');
    	            }
    	        },

    	        /**
    	         * Converts a UTF-8 string to a word array.
    	         *
    	         * @param {string} utf8Str The UTF-8 string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
    	         */
    	        parse: function (utf8Str) {
    	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
    	        }
    	    };

    	    /**
    	     * Abstract buffered block algorithm template.
    	     *
    	     * The property blockSize must be implemented in a concrete subtype.
    	     *
    	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
    	     */
    	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
    	        /**
    	         * Resets this block algorithm's data buffer to its initial state.
    	         *
    	         * @example
    	         *
    	         *     bufferedBlockAlgorithm.reset();
    	         */
    	        reset: function () {
    	            // Initial values
    	            this._data = new WordArray.init();
    	            this._nDataBytes = 0;
    	        },

    	        /**
    	         * Adds new data to this block algorithm's buffer.
    	         *
    	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
    	         *
    	         * @example
    	         *
    	         *     bufferedBlockAlgorithm._append('data');
    	         *     bufferedBlockAlgorithm._append(wordArray);
    	         */
    	        _append: function (data) {
    	            // Convert string to WordArray, else assume WordArray already
    	            if (typeof data == 'string') {
    	                data = Utf8.parse(data);
    	            }

    	            // Append
    	            this._data.concat(data);
    	            this._nDataBytes += data.sigBytes;
    	        },

    	        /**
    	         * Processes available data blocks.
    	         *
    	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
    	         *
    	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
    	         *
    	         * @return {WordArray} The processed data.
    	         *
    	         * @example
    	         *
    	         *     var processedData = bufferedBlockAlgorithm._process();
    	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
    	         */
    	        _process: function (doFlush) {
    	            var processedWords;

    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;
    	            var dataSigBytes = data.sigBytes;
    	            var blockSize = this.blockSize;
    	            var blockSizeBytes = blockSize * 4;

    	            // Count blocks ready
    	            var nBlocksReady = dataSigBytes / blockSizeBytes;
    	            if (doFlush) {
    	                // Round up to include partial blocks
    	                nBlocksReady = Math.ceil(nBlocksReady);
    	            } else {
    	                // Round down to include only full blocks,
    	                // less the number of blocks that must remain in the buffer
    	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    	            }

    	            // Count words ready
    	            var nWordsReady = nBlocksReady * blockSize;

    	            // Count bytes ready
    	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

    	            // Process blocks
    	            if (nWordsReady) {
    	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
    	                    // Perform concrete-algorithm logic
    	                    this._doProcessBlock(dataWords, offset);
    	                }

    	                // Remove processed words
    	                processedWords = dataWords.splice(0, nWordsReady);
    	                data.sigBytes -= nBytesReady;
    	            }

    	            // Return processed words
    	            return new WordArray.init(processedWords, nBytesReady);
    	        },

    	        /**
    	         * Creates a copy of this object.
    	         *
    	         * @return {Object} The clone.
    	         *
    	         * @example
    	         *
    	         *     var clone = bufferedBlockAlgorithm.clone();
    	         */
    	        clone: function () {
    	            var clone = Base.clone.call(this);
    	            clone._data = this._data.clone();

    	            return clone;
    	        },

    	        _minBufferSize: 0
    	    });

    	    /**
    	     * Abstract hasher template.
    	     *
    	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
    	     */
    	    C_lib.Hasher = BufferedBlockAlgorithm.extend({
    	        /**
    	         * Configuration options.
    	         */
    	        cfg: Base.extend(),

    	        /**
    	         * Initializes a newly created hasher.
    	         *
    	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
    	         *
    	         * @example
    	         *
    	         *     var hasher = CryptoJS.algo.SHA256.create();
    	         */
    	        init: function (cfg) {
    	            // Apply config defaults
    	            this.cfg = this.cfg.extend(cfg);

    	            // Set initial values
    	            this.reset();
    	        },

    	        /**
    	         * Resets this hasher to its initial state.
    	         *
    	         * @example
    	         *
    	         *     hasher.reset();
    	         */
    	        reset: function () {
    	            // Reset data buffer
    	            BufferedBlockAlgorithm.reset.call(this);

    	            // Perform concrete-hasher logic
    	            this._doReset();
    	        },

    	        /**
    	         * Updates this hasher with a message.
    	         *
    	         * @param {WordArray|string} messageUpdate The message to append.
    	         *
    	         * @return {Hasher} This hasher.
    	         *
    	         * @example
    	         *
    	         *     hasher.update('message');
    	         *     hasher.update(wordArray);
    	         */
    	        update: function (messageUpdate) {
    	            // Append
    	            this._append(messageUpdate);

    	            // Update the hash
    	            this._process();

    	            // Chainable
    	            return this;
    	        },

    	        /**
    	         * Finalizes the hash computation.
    	         * Note that the finalize operation is effectively a destructive, read-once operation.
    	         *
    	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
    	         *
    	         * @return {WordArray} The hash.
    	         *
    	         * @example
    	         *
    	         *     var hash = hasher.finalize();
    	         *     var hash = hasher.finalize('message');
    	         *     var hash = hasher.finalize(wordArray);
    	         */
    	        finalize: function (messageUpdate) {
    	            // Final message update
    	            if (messageUpdate) {
    	                this._append(messageUpdate);
    	            }

    	            // Perform concrete-hasher logic
    	            var hash = this._doFinalize();

    	            return hash;
    	        },

    	        blockSize: 512/32,

    	        /**
    	         * Creates a shortcut function to a hasher's object interface.
    	         *
    	         * @param {Hasher} hasher The hasher to create a helper for.
    	         *
    	         * @return {Function} The shortcut function.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
    	         */
    	        _createHelper: function (hasher) {
    	            return function (message, cfg) {
    	                return new hasher.init(cfg).finalize(message);
    	            };
    	        },

    	        /**
    	         * Creates a shortcut function to the HMAC's object interface.
    	         *
    	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
    	         *
    	         * @return {Function} The shortcut function.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
    	         */
    	        _createHmacHelper: function (hasher) {
    	            return function (message, key) {
    	                return new C_algo.HMAC.init(hasher, key).finalize(message);
    	            };
    	        }
    	    });

    	    /**
    	     * Algorithm namespace.
    	     */
    	    var C_algo = C.algo = {};

    	    return C;
    	}(Math));


    	return CryptoJS;

    }));
    });

    var x64Core = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function (undefined$1) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var Base = C_lib.Base;
    	    var X32WordArray = C_lib.WordArray;

    	    /**
    	     * x64 namespace.
    	     */
    	    var C_x64 = C.x64 = {};

    	    /**
    	     * A 64-bit word.
    	     */
    	    C_x64.Word = Base.extend({
    	        /**
    	         * Initializes a newly created 64-bit word.
    	         *
    	         * @param {number} high The high 32 bits.
    	         * @param {number} low The low 32 bits.
    	         *
    	         * @example
    	         *
    	         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
    	         */
    	        init: function (high, low) {
    	            this.high = high;
    	            this.low = low;
    	        }

    	        /**
    	         * Bitwise NOTs this word.
    	         *
    	         * @return {X64Word} A new x64-Word object after negating.
    	         *
    	         * @example
    	         *
    	         *     var negated = x64Word.not();
    	         */
    	        // not: function () {
    	            // var high = ~this.high;
    	            // var low = ~this.low;

    	            // return X64Word.create(high, low);
    	        // },

    	        /**
    	         * Bitwise ANDs this word with the passed word.
    	         *
    	         * @param {X64Word} word The x64-Word to AND with this word.
    	         *
    	         * @return {X64Word} A new x64-Word object after ANDing.
    	         *
    	         * @example
    	         *
    	         *     var anded = x64Word.and(anotherX64Word);
    	         */
    	        // and: function (word) {
    	            // var high = this.high & word.high;
    	            // var low = this.low & word.low;

    	            // return X64Word.create(high, low);
    	        // },

    	        /**
    	         * Bitwise ORs this word with the passed word.
    	         *
    	         * @param {X64Word} word The x64-Word to OR with this word.
    	         *
    	         * @return {X64Word} A new x64-Word object after ORing.
    	         *
    	         * @example
    	         *
    	         *     var ored = x64Word.or(anotherX64Word);
    	         */
    	        // or: function (word) {
    	            // var high = this.high | word.high;
    	            // var low = this.low | word.low;

    	            // return X64Word.create(high, low);
    	        // },

    	        /**
    	         * Bitwise XORs this word with the passed word.
    	         *
    	         * @param {X64Word} word The x64-Word to XOR with this word.
    	         *
    	         * @return {X64Word} A new x64-Word object after XORing.
    	         *
    	         * @example
    	         *
    	         *     var xored = x64Word.xor(anotherX64Word);
    	         */
    	        // xor: function (word) {
    	            // var high = this.high ^ word.high;
    	            // var low = this.low ^ word.low;

    	            // return X64Word.create(high, low);
    	        // },

    	        /**
    	         * Shifts this word n bits to the left.
    	         *
    	         * @param {number} n The number of bits to shift.
    	         *
    	         * @return {X64Word} A new x64-Word object after shifting.
    	         *
    	         * @example
    	         *
    	         *     var shifted = x64Word.shiftL(25);
    	         */
    	        // shiftL: function (n) {
    	            // if (n < 32) {
    	                // var high = (this.high << n) | (this.low >>> (32 - n));
    	                // var low = this.low << n;
    	            // } else {
    	                // var high = this.low << (n - 32);
    	                // var low = 0;
    	            // }

    	            // return X64Word.create(high, low);
    	        // },

    	        /**
    	         * Shifts this word n bits to the right.
    	         *
    	         * @param {number} n The number of bits to shift.
    	         *
    	         * @return {X64Word} A new x64-Word object after shifting.
    	         *
    	         * @example
    	         *
    	         *     var shifted = x64Word.shiftR(7);
    	         */
    	        // shiftR: function (n) {
    	            // if (n < 32) {
    	                // var low = (this.low >>> n) | (this.high << (32 - n));
    	                // var high = this.high >>> n;
    	            // } else {
    	                // var low = this.high >>> (n - 32);
    	                // var high = 0;
    	            // }

    	            // return X64Word.create(high, low);
    	        // },

    	        /**
    	         * Rotates this word n bits to the left.
    	         *
    	         * @param {number} n The number of bits to rotate.
    	         *
    	         * @return {X64Word} A new x64-Word object after rotating.
    	         *
    	         * @example
    	         *
    	         *     var rotated = x64Word.rotL(25);
    	         */
    	        // rotL: function (n) {
    	            // return this.shiftL(n).or(this.shiftR(64 - n));
    	        // },

    	        /**
    	         * Rotates this word n bits to the right.
    	         *
    	         * @param {number} n The number of bits to rotate.
    	         *
    	         * @return {X64Word} A new x64-Word object after rotating.
    	         *
    	         * @example
    	         *
    	         *     var rotated = x64Word.rotR(7);
    	         */
    	        // rotR: function (n) {
    	            // return this.shiftR(n).or(this.shiftL(64 - n));
    	        // },

    	        /**
    	         * Adds this word with the passed word.
    	         *
    	         * @param {X64Word} word The x64-Word to add with this word.
    	         *
    	         * @return {X64Word} A new x64-Word object after adding.
    	         *
    	         * @example
    	         *
    	         *     var added = x64Word.add(anotherX64Word);
    	         */
    	        // add: function (word) {
    	            // var low = (this.low + word.low) | 0;
    	            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
    	            // var high = (this.high + word.high + carry) | 0;

    	            // return X64Word.create(high, low);
    	        // }
    	    });

    	    /**
    	     * An array of 64-bit words.
    	     *
    	     * @property {Array} words The array of CryptoJS.x64.Word objects.
    	     * @property {number} sigBytes The number of significant bytes in this word array.
    	     */
    	    C_x64.WordArray = Base.extend({
    	        /**
    	         * Initializes a newly created word array.
    	         *
    	         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
    	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.x64.WordArray.create();
    	         *
    	         *     var wordArray = CryptoJS.x64.WordArray.create([
    	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
    	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
    	         *     ]);
    	         *
    	         *     var wordArray = CryptoJS.x64.WordArray.create([
    	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
    	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
    	         *     ], 10);
    	         */
    	        init: function (words, sigBytes) {
    	            words = this.words = words || [];

    	            if (sigBytes != undefined$1) {
    	                this.sigBytes = sigBytes;
    	            } else {
    	                this.sigBytes = words.length * 8;
    	            }
    	        },

    	        /**
    	         * Converts this 64-bit word array to a 32-bit word array.
    	         *
    	         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
    	         *
    	         * @example
    	         *
    	         *     var x32WordArray = x64WordArray.toX32();
    	         */
    	        toX32: function () {
    	            // Shortcuts
    	            var x64Words = this.words;
    	            var x64WordsLength = x64Words.length;

    	            // Convert
    	            var x32Words = [];
    	            for (var i = 0; i < x64WordsLength; i++) {
    	                var x64Word = x64Words[i];
    	                x32Words.push(x64Word.high);
    	                x32Words.push(x64Word.low);
    	            }

    	            return X32WordArray.create(x32Words, this.sigBytes);
    	        },

    	        /**
    	         * Creates a copy of this word array.
    	         *
    	         * @return {X64WordArray} The clone.
    	         *
    	         * @example
    	         *
    	         *     var clone = x64WordArray.clone();
    	         */
    	        clone: function () {
    	            var clone = Base.clone.call(this);

    	            // Clone "words" array
    	            var words = clone.words = this.words.slice(0);

    	            // Clone each X64Word object
    	            var wordsLength = words.length;
    	            for (var i = 0; i < wordsLength; i++) {
    	                words[i] = words[i].clone();
    	            }

    	            return clone;
    	        }
    	    });
    	}());


    	return CryptoJS;

    }));
    });

    var libTypedarrays = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Check if typed arrays are supported
    	    if (typeof ArrayBuffer != 'function') {
    	        return;
    	    }

    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;

    	    // Reference original init
    	    var superInit = WordArray.init;

    	    // Augment WordArray.init to handle typed arrays
    	    var subInit = WordArray.init = function (typedArray) {
    	        // Convert buffers to uint8
    	        if (typedArray instanceof ArrayBuffer) {
    	            typedArray = new Uint8Array(typedArray);
    	        }

    	        // Convert other array views to uint8
    	        if (
    	            typedArray instanceof Int8Array ||
    	            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
    	            typedArray instanceof Int16Array ||
    	            typedArray instanceof Uint16Array ||
    	            typedArray instanceof Int32Array ||
    	            typedArray instanceof Uint32Array ||
    	            typedArray instanceof Float32Array ||
    	            typedArray instanceof Float64Array
    	        ) {
    	            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    	        }

    	        // Handle Uint8Array
    	        if (typedArray instanceof Uint8Array) {
    	            // Shortcut
    	            var typedArrayByteLength = typedArray.byteLength;

    	            // Extract bytes
    	            var words = [];
    	            for (var i = 0; i < typedArrayByteLength; i++) {
    	                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
    	            }

    	            // Initialize this word array
    	            superInit.call(this, words, typedArrayByteLength);
    	        } else {
    	            // Else call normal init
    	            superInit.apply(this, arguments);
    	        }
    	    };

    	    subInit.prototype = WordArray;
    	}());


    	return CryptoJS.lib.WordArray;

    }));
    });

    var encUtf16 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var C_enc = C.enc;

    	    /**
    	     * UTF-16 BE encoding strategy.
    	     */
    	    C_enc.Utf16 = C_enc.Utf16BE = {
    	        /**
    	         * Converts a word array to a UTF-16 BE string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The UTF-16 BE string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;

    	            // Convert
    	            var utf16Chars = [];
    	            for (var i = 0; i < sigBytes; i += 2) {
    	                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
    	                utf16Chars.push(String.fromCharCode(codePoint));
    	            }

    	            return utf16Chars.join('');
    	        },

    	        /**
    	         * Converts a UTF-16 BE string to a word array.
    	         *
    	         * @param {string} utf16Str The UTF-16 BE string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
    	         */
    	        parse: function (utf16Str) {
    	            // Shortcut
    	            var utf16StrLength = utf16Str.length;

    	            // Convert
    	            var words = [];
    	            for (var i = 0; i < utf16StrLength; i++) {
    	                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
    	            }

    	            return WordArray.create(words, utf16StrLength * 2);
    	        }
    	    };

    	    /**
    	     * UTF-16 LE encoding strategy.
    	     */
    	    C_enc.Utf16LE = {
    	        /**
    	         * Converts a word array to a UTF-16 LE string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The UTF-16 LE string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;

    	            // Convert
    	            var utf16Chars = [];
    	            for (var i = 0; i < sigBytes; i += 2) {
    	                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
    	                utf16Chars.push(String.fromCharCode(codePoint));
    	            }

    	            return utf16Chars.join('');
    	        },

    	        /**
    	         * Converts a UTF-16 LE string to a word array.
    	         *
    	         * @param {string} utf16Str The UTF-16 LE string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
    	         */
    	        parse: function (utf16Str) {
    	            // Shortcut
    	            var utf16StrLength = utf16Str.length;

    	            // Convert
    	            var words = [];
    	            for (var i = 0; i < utf16StrLength; i++) {
    	                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
    	            }

    	            return WordArray.create(words, utf16StrLength * 2);
    	        }
    	    };

    	    function swapEndian(word) {
    	        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
    	    }
    	}());


    	return CryptoJS.enc.Utf16;

    }));
    });

    var encBase64 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var C_enc = C.enc;

    	    /**
    	     * Base64 encoding strategy.
    	     */
    	    C_enc.Base64 = {
    	        /**
    	         * Converts a word array to a Base64 string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @return {string} The Base64 string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
    	         */
    	        stringify: function (wordArray) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;
    	            var map = this._map;

    	            // Clamp excess bits
    	            wordArray.clamp();

    	            // Convert
    	            var base64Chars = [];
    	            for (var i = 0; i < sigBytes; i += 3) {
    	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
    	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
    	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

    	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

    	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
    	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
    	                }
    	            }

    	            // Add padding
    	            var paddingChar = map.charAt(64);
    	            if (paddingChar) {
    	                while (base64Chars.length % 4) {
    	                    base64Chars.push(paddingChar);
    	                }
    	            }

    	            return base64Chars.join('');
    	        },

    	        /**
    	         * Converts a Base64 string to a word array.
    	         *
    	         * @param {string} base64Str The Base64 string.
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
    	         */
    	        parse: function (base64Str) {
    	            // Shortcuts
    	            var base64StrLength = base64Str.length;
    	            var map = this._map;
    	            var reverseMap = this._reverseMap;

    	            if (!reverseMap) {
    	                    reverseMap = this._reverseMap = [];
    	                    for (var j = 0; j < map.length; j++) {
    	                        reverseMap[map.charCodeAt(j)] = j;
    	                    }
    	            }

    	            // Ignore padding
    	            var paddingChar = map.charAt(64);
    	            if (paddingChar) {
    	                var paddingIndex = base64Str.indexOf(paddingChar);
    	                if (paddingIndex !== -1) {
    	                    base64StrLength = paddingIndex;
    	                }
    	            }

    	            // Convert
    	            return parseLoop(base64Str, base64StrLength, reverseMap);

    	        },

    	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    	    };

    	    function parseLoop(base64Str, base64StrLength, reverseMap) {
    	      var words = [];
    	      var nBytes = 0;
    	      for (var i = 0; i < base64StrLength; i++) {
    	          if (i % 4) {
    	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
    	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
    	              var bitsCombined = bits1 | bits2;
    	              words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
    	              nBytes++;
    	          }
    	      }
    	      return WordArray.create(words, nBytes);
    	    }
    	}());


    	return CryptoJS.enc.Base64;

    }));
    });

    var encBase64url = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var C_enc = C.enc;

    	    /**
    	     * Base64url encoding strategy.
    	     */
    	    C_enc.Base64url = {
    	        /**
    	         * Converts a word array to a Base64url string.
    	         *
    	         * @param {WordArray} wordArray The word array.
    	         *
    	         * @param {boolean} urlSafe Whether to use url safe
    	         *
    	         * @return {string} The Base64url string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
    	         */
    	        stringify: function (wordArray, urlSafe=true) {
    	            // Shortcuts
    	            var words = wordArray.words;
    	            var sigBytes = wordArray.sigBytes;
    	            var map = urlSafe ? this._safe_map : this._map;

    	            // Clamp excess bits
    	            wordArray.clamp();

    	            // Convert
    	            var base64Chars = [];
    	            for (var i = 0; i < sigBytes; i += 3) {
    	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
    	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
    	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

    	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

    	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
    	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
    	                }
    	            }

    	            // Add padding
    	            var paddingChar = map.charAt(64);
    	            if (paddingChar) {
    	                while (base64Chars.length % 4) {
    	                    base64Chars.push(paddingChar);
    	                }
    	            }

    	            return base64Chars.join('');
    	        },

    	        /**
    	         * Converts a Base64url string to a word array.
    	         *
    	         * @param {string} base64Str The Base64url string.
    	         *
    	         * @param {boolean} urlSafe Whether to use url safe
    	         *
    	         * @return {WordArray} The word array.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
    	         */
    	        parse: function (base64Str, urlSafe=true) {
    	            // Shortcuts
    	            var base64StrLength = base64Str.length;
    	            var map = urlSafe ? this._safe_map : this._map;
    	            var reverseMap = this._reverseMap;

    	            if (!reverseMap) {
    	                reverseMap = this._reverseMap = [];
    	                for (var j = 0; j < map.length; j++) {
    	                    reverseMap[map.charCodeAt(j)] = j;
    	                }
    	            }

    	            // Ignore padding
    	            var paddingChar = map.charAt(64);
    	            if (paddingChar) {
    	                var paddingIndex = base64Str.indexOf(paddingChar);
    	                if (paddingIndex !== -1) {
    	                    base64StrLength = paddingIndex;
    	                }
    	            }

    	            // Convert
    	            return parseLoop(base64Str, base64StrLength, reverseMap);

    	        },

    	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    	        _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    	    };

    	    function parseLoop(base64Str, base64StrLength, reverseMap) {
    	        var words = [];
    	        var nBytes = 0;
    	        for (var i = 0; i < base64StrLength; i++) {
    	            if (i % 4) {
    	                var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
    	                var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
    	                var bitsCombined = bits1 | bits2;
    	                words[nBytes >>> 2] |= bitsCombined << (24 - (nBytes % 4) * 8);
    	                nBytes++;
    	            }
    	        }
    	        return WordArray.create(words, nBytes);
    	    }
    	}());

    	return CryptoJS.enc.Base64url;

    }));
    });

    var md5 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function (Math) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var Hasher = C_lib.Hasher;
    	    var C_algo = C.algo;

    	    // Constants table
    	    var T = [];

    	    // Compute constants
    	    (function () {
    	        for (var i = 0; i < 64; i++) {
    	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
    	        }
    	    }());

    	    /**
    	     * MD5 hash algorithm.
    	     */
    	    var MD5 = C_algo.MD5 = Hasher.extend({
    	        _doReset: function () {
    	            this._hash = new WordArray.init([
    	                0x67452301, 0xefcdab89,
    	                0x98badcfe, 0x10325476
    	            ]);
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Swap endian
    	            for (var i = 0; i < 16; i++) {
    	                // Shortcuts
    	                var offset_i = offset + i;
    	                var M_offset_i = M[offset_i];

    	                M[offset_i] = (
    	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
    	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
    	                );
    	            }

    	            // Shortcuts
    	            var H = this._hash.words;

    	            var M_offset_0  = M[offset + 0];
    	            var M_offset_1  = M[offset + 1];
    	            var M_offset_2  = M[offset + 2];
    	            var M_offset_3  = M[offset + 3];
    	            var M_offset_4  = M[offset + 4];
    	            var M_offset_5  = M[offset + 5];
    	            var M_offset_6  = M[offset + 6];
    	            var M_offset_7  = M[offset + 7];
    	            var M_offset_8  = M[offset + 8];
    	            var M_offset_9  = M[offset + 9];
    	            var M_offset_10 = M[offset + 10];
    	            var M_offset_11 = M[offset + 11];
    	            var M_offset_12 = M[offset + 12];
    	            var M_offset_13 = M[offset + 13];
    	            var M_offset_14 = M[offset + 14];
    	            var M_offset_15 = M[offset + 15];

    	            // Working varialbes
    	            var a = H[0];
    	            var b = H[1];
    	            var c = H[2];
    	            var d = H[3];

    	            // Computation
    	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
    	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
    	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
    	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
    	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
    	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
    	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
    	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
    	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
    	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
    	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
    	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
    	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
    	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
    	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
    	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

    	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
    	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
    	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
    	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
    	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
    	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
    	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
    	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
    	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
    	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
    	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
    	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
    	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
    	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
    	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
    	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

    	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
    	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
    	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
    	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
    	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
    	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
    	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
    	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
    	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
    	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
    	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
    	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
    	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
    	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
    	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
    	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

    	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
    	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
    	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
    	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
    	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
    	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
    	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
    	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
    	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
    	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
    	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
    	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
    	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
    	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
    	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
    	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

    	            // Intermediate hash value
    	            H[0] = (H[0] + a) | 0;
    	            H[1] = (H[1] + b) | 0;
    	            H[2] = (H[2] + c) | 0;
    	            H[3] = (H[3] + d) | 0;
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;

    	            var nBitsTotal = this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

    	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
    	            var nBitsTotalL = nBitsTotal;
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
    	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
    	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
    	            );
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
    	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
    	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
    	            );

    	            data.sigBytes = (dataWords.length + 1) * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Shortcuts
    	            var hash = this._hash;
    	            var H = hash.words;

    	            // Swap endian
    	            for (var i = 0; i < 4; i++) {
    	                // Shortcut
    	                var H_i = H[i];

    	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
    	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
    	            }

    	            // Return final computed hash
    	            return hash;
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);
    	            clone._hash = this._hash.clone();

    	            return clone;
    	        }
    	    });

    	    function FF(a, b, c, d, x, s, t) {
    	        var n = a + ((b & c) | (~b & d)) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    function GG(a, b, c, d, x, s, t) {
    	        var n = a + ((b & d) | (c & ~d)) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    function HH(a, b, c, d, x, s, t) {
    	        var n = a + (b ^ c ^ d) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    function II(a, b, c, d, x, s, t) {
    	        var n = a + (c ^ (b | ~d)) + x + t;
    	        return ((n << s) | (n >>> (32 - s))) + b;
    	    }

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.MD5('message');
    	     *     var hash = CryptoJS.MD5(wordArray);
    	     */
    	    C.MD5 = Hasher._createHelper(MD5);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacMD5(message, key);
    	     */
    	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
    	}(Math));


    	return CryptoJS.MD5;

    }));
    });

    var sha1 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var Hasher = C_lib.Hasher;
    	    var C_algo = C.algo;

    	    // Reusable object
    	    var W = [];

    	    /**
    	     * SHA-1 hash algorithm.
    	     */
    	    var SHA1 = C_algo.SHA1 = Hasher.extend({
    	        _doReset: function () {
    	            this._hash = new WordArray.init([
    	                0x67452301, 0xefcdab89,
    	                0x98badcfe, 0x10325476,
    	                0xc3d2e1f0
    	            ]);
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Shortcut
    	            var H = this._hash.words;

    	            // Working variables
    	            var a = H[0];
    	            var b = H[1];
    	            var c = H[2];
    	            var d = H[3];
    	            var e = H[4];

    	            // Computation
    	            for (var i = 0; i < 80; i++) {
    	                if (i < 16) {
    	                    W[i] = M[offset + i] | 0;
    	                } else {
    	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
    	                    W[i] = (n << 1) | (n >>> 31);
    	                }

    	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
    	                if (i < 20) {
    	                    t += ((b & c) | (~b & d)) + 0x5a827999;
    	                } else if (i < 40) {
    	                    t += (b ^ c ^ d) + 0x6ed9eba1;
    	                } else if (i < 60) {
    	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
    	                } else /* if (i < 80) */ {
    	                    t += (b ^ c ^ d) - 0x359d3e2a;
    	                }

    	                e = d;
    	                d = c;
    	                c = (b << 30) | (b >>> 2);
    	                b = a;
    	                a = t;
    	            }

    	            // Intermediate hash value
    	            H[0] = (H[0] + a) | 0;
    	            H[1] = (H[1] + b) | 0;
    	            H[2] = (H[2] + c) | 0;
    	            H[3] = (H[3] + d) | 0;
    	            H[4] = (H[4] + e) | 0;
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;

    	            var nBitsTotal = this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
    	            data.sigBytes = dataWords.length * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Return final computed hash
    	            return this._hash;
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);
    	            clone._hash = this._hash.clone();

    	            return clone;
    	        }
    	    });

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.SHA1('message');
    	     *     var hash = CryptoJS.SHA1(wordArray);
    	     */
    	    C.SHA1 = Hasher._createHelper(SHA1);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacSHA1(message, key);
    	     */
    	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
    	}());


    	return CryptoJS.SHA1;

    }));
    });

    var sha256 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function (Math) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var Hasher = C_lib.Hasher;
    	    var C_algo = C.algo;

    	    // Initialization and round constants tables
    	    var H = [];
    	    var K = [];

    	    // Compute constants
    	    (function () {
    	        function isPrime(n) {
    	            var sqrtN = Math.sqrt(n);
    	            for (var factor = 2; factor <= sqrtN; factor++) {
    	                if (!(n % factor)) {
    	                    return false;
    	                }
    	            }

    	            return true;
    	        }

    	        function getFractionalBits(n) {
    	            return ((n - (n | 0)) * 0x100000000) | 0;
    	        }

    	        var n = 2;
    	        var nPrime = 0;
    	        while (nPrime < 64) {
    	            if (isPrime(n)) {
    	                if (nPrime < 8) {
    	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
    	                }
    	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

    	                nPrime++;
    	            }

    	            n++;
    	        }
    	    }());

    	    // Reusable object
    	    var W = [];

    	    /**
    	     * SHA-256 hash algorithm.
    	     */
    	    var SHA256 = C_algo.SHA256 = Hasher.extend({
    	        _doReset: function () {
    	            this._hash = new WordArray.init(H.slice(0));
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Shortcut
    	            var H = this._hash.words;

    	            // Working variables
    	            var a = H[0];
    	            var b = H[1];
    	            var c = H[2];
    	            var d = H[3];
    	            var e = H[4];
    	            var f = H[5];
    	            var g = H[6];
    	            var h = H[7];

    	            // Computation
    	            for (var i = 0; i < 64; i++) {
    	                if (i < 16) {
    	                    W[i] = M[offset + i] | 0;
    	                } else {
    	                    var gamma0x = W[i - 15];
    	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
    	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
    	                                   (gamma0x >>> 3);

    	                    var gamma1x = W[i - 2];
    	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
    	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
    	                                   (gamma1x >>> 10);

    	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    	                }

    	                var ch  = (e & f) ^ (~e & g);
    	                var maj = (a & b) ^ (a & c) ^ (b & c);

    	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    	                var t1 = h + sigma1 + ch + K[i] + W[i];
    	                var t2 = sigma0 + maj;

    	                h = g;
    	                g = f;
    	                f = e;
    	                e = (d + t1) | 0;
    	                d = c;
    	                c = b;
    	                b = a;
    	                a = (t1 + t2) | 0;
    	            }

    	            // Intermediate hash value
    	            H[0] = (H[0] + a) | 0;
    	            H[1] = (H[1] + b) | 0;
    	            H[2] = (H[2] + c) | 0;
    	            H[3] = (H[3] + d) | 0;
    	            H[4] = (H[4] + e) | 0;
    	            H[5] = (H[5] + f) | 0;
    	            H[6] = (H[6] + g) | 0;
    	            H[7] = (H[7] + h) | 0;
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;

    	            var nBitsTotal = this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
    	            data.sigBytes = dataWords.length * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Return final computed hash
    	            return this._hash;
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);
    	            clone._hash = this._hash.clone();

    	            return clone;
    	        }
    	    });

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.SHA256('message');
    	     *     var hash = CryptoJS.SHA256(wordArray);
    	     */
    	    C.SHA256 = Hasher._createHelper(SHA256);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacSHA256(message, key);
    	     */
    	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
    	}(Math));


    	return CryptoJS.SHA256;

    }));
    });

    var sha224 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, sha256);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var C_algo = C.algo;
    	    var SHA256 = C_algo.SHA256;

    	    /**
    	     * SHA-224 hash algorithm.
    	     */
    	    var SHA224 = C_algo.SHA224 = SHA256.extend({
    	        _doReset: function () {
    	            this._hash = new WordArray.init([
    	                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    	                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
    	            ]);
    	        },

    	        _doFinalize: function () {
    	            var hash = SHA256._doFinalize.call(this);

    	            hash.sigBytes -= 4;

    	            return hash;
    	        }
    	    });

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.SHA224('message');
    	     *     var hash = CryptoJS.SHA224(wordArray);
    	     */
    	    C.SHA224 = SHA256._createHelper(SHA224);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacSHA224(message, key);
    	     */
    	    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
    	}());


    	return CryptoJS.SHA224;

    }));
    });

    var sha512 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, x64Core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var Hasher = C_lib.Hasher;
    	    var C_x64 = C.x64;
    	    var X64Word = C_x64.Word;
    	    var X64WordArray = C_x64.WordArray;
    	    var C_algo = C.algo;

    	    function X64Word_create() {
    	        return X64Word.create.apply(X64Word, arguments);
    	    }

    	    // Constants
    	    var K = [
    	        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
    	        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
    	        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
    	        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
    	        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
    	        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
    	        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
    	        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
    	        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
    	        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
    	        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
    	        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
    	        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
    	        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
    	        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
    	        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
    	        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
    	        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
    	        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
    	        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
    	        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
    	        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
    	        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
    	        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
    	        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
    	        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
    	        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
    	        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
    	        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
    	        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
    	        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
    	        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
    	        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
    	        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
    	        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
    	        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
    	        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
    	        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
    	        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
    	        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
    	    ];

    	    // Reusable objects
    	    var W = [];
    	    (function () {
    	        for (var i = 0; i < 80; i++) {
    	            W[i] = X64Word_create();
    	        }
    	    }());

    	    /**
    	     * SHA-512 hash algorithm.
    	     */
    	    var SHA512 = C_algo.SHA512 = Hasher.extend({
    	        _doReset: function () {
    	            this._hash = new X64WordArray.init([
    	                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
    	                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
    	                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
    	                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
    	            ]);
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Shortcuts
    	            var H = this._hash.words;

    	            var H0 = H[0];
    	            var H1 = H[1];
    	            var H2 = H[2];
    	            var H3 = H[3];
    	            var H4 = H[4];
    	            var H5 = H[5];
    	            var H6 = H[6];
    	            var H7 = H[7];

    	            var H0h = H0.high;
    	            var H0l = H0.low;
    	            var H1h = H1.high;
    	            var H1l = H1.low;
    	            var H2h = H2.high;
    	            var H2l = H2.low;
    	            var H3h = H3.high;
    	            var H3l = H3.low;
    	            var H4h = H4.high;
    	            var H4l = H4.low;
    	            var H5h = H5.high;
    	            var H5l = H5.low;
    	            var H6h = H6.high;
    	            var H6l = H6.low;
    	            var H7h = H7.high;
    	            var H7l = H7.low;

    	            // Working variables
    	            var ah = H0h;
    	            var al = H0l;
    	            var bh = H1h;
    	            var bl = H1l;
    	            var ch = H2h;
    	            var cl = H2l;
    	            var dh = H3h;
    	            var dl = H3l;
    	            var eh = H4h;
    	            var el = H4l;
    	            var fh = H5h;
    	            var fl = H5l;
    	            var gh = H6h;
    	            var gl = H6l;
    	            var hh = H7h;
    	            var hl = H7l;

    	            // Rounds
    	            for (var i = 0; i < 80; i++) {
    	                var Wil;
    	                var Wih;

    	                // Shortcut
    	                var Wi = W[i];

    	                // Extend message
    	                if (i < 16) {
    	                    Wih = Wi.high = M[offset + i * 2]     | 0;
    	                    Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
    	                } else {
    	                    // Gamma0
    	                    var gamma0x  = W[i - 15];
    	                    var gamma0xh = gamma0x.high;
    	                    var gamma0xl = gamma0x.low;
    	                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
    	                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

    	                    // Gamma1
    	                    var gamma1x  = W[i - 2];
    	                    var gamma1xh = gamma1x.high;
    	                    var gamma1xl = gamma1x.low;
    	                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
    	                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

    	                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
    	                    var Wi7  = W[i - 7];
    	                    var Wi7h = Wi7.high;
    	                    var Wi7l = Wi7.low;

    	                    var Wi16  = W[i - 16];
    	                    var Wi16h = Wi16.high;
    	                    var Wi16l = Wi16.low;

    	                    Wil = gamma0l + Wi7l;
    	                    Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
    	                    Wil = Wil + gamma1l;
    	                    Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
    	                    Wil = Wil + Wi16l;
    	                    Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

    	                    Wi.high = Wih;
    	                    Wi.low  = Wil;
    	                }

    	                var chh  = (eh & fh) ^ (~eh & gh);
    	                var chl  = (el & fl) ^ (~el & gl);
    	                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
    	                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

    	                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
    	                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
    	                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
    	                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

    	                // t1 = h + sigma1 + ch + K[i] + W[i]
    	                var Ki  = K[i];
    	                var Kih = Ki.high;
    	                var Kil = Ki.low;

    	                var t1l = hl + sigma1l;
    	                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
    	                var t1l = t1l + chl;
    	                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
    	                var t1l = t1l + Kil;
    	                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
    	                var t1l = t1l + Wil;
    	                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

    	                // t2 = sigma0 + maj
    	                var t2l = sigma0l + majl;
    	                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

    	                // Update working variables
    	                hh = gh;
    	                hl = gl;
    	                gh = fh;
    	                gl = fl;
    	                fh = eh;
    	                fl = el;
    	                el = (dl + t1l) | 0;
    	                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
    	                dh = ch;
    	                dl = cl;
    	                ch = bh;
    	                cl = bl;
    	                bh = ah;
    	                bl = al;
    	                al = (t1l + t2l) | 0;
    	                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
    	            }

    	            // Intermediate hash value
    	            H0l = H0.low  = (H0l + al);
    	            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
    	            H1l = H1.low  = (H1l + bl);
    	            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
    	            H2l = H2.low  = (H2l + cl);
    	            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
    	            H3l = H3.low  = (H3l + dl);
    	            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
    	            H4l = H4.low  = (H4l + el);
    	            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
    	            H5l = H5.low  = (H5l + fl);
    	            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
    	            H6l = H6.low  = (H6l + gl);
    	            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
    	            H7l = H7.low  = (H7l + hl);
    	            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;

    	            var nBitsTotal = this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
    	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
    	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
    	            data.sigBytes = dataWords.length * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Convert hash to 32-bit word array before returning
    	            var hash = this._hash.toX32();

    	            // Return final computed hash
    	            return hash;
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);
    	            clone._hash = this._hash.clone();

    	            return clone;
    	        },

    	        blockSize: 1024/32
    	    });

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.SHA512('message');
    	     *     var hash = CryptoJS.SHA512(wordArray);
    	     */
    	    C.SHA512 = Hasher._createHelper(SHA512);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacSHA512(message, key);
    	     */
    	    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
    	}());


    	return CryptoJS.SHA512;

    }));
    });

    var sha384 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, x64Core, sha512);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_x64 = C.x64;
    	    var X64Word = C_x64.Word;
    	    var X64WordArray = C_x64.WordArray;
    	    var C_algo = C.algo;
    	    var SHA512 = C_algo.SHA512;

    	    /**
    	     * SHA-384 hash algorithm.
    	     */
    	    var SHA384 = C_algo.SHA384 = SHA512.extend({
    	        _doReset: function () {
    	            this._hash = new X64WordArray.init([
    	                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
    	                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
    	                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
    	                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
    	            ]);
    	        },

    	        _doFinalize: function () {
    	            var hash = SHA512._doFinalize.call(this);

    	            hash.sigBytes -= 16;

    	            return hash;
    	        }
    	    });

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.SHA384('message');
    	     *     var hash = CryptoJS.SHA384(wordArray);
    	     */
    	    C.SHA384 = SHA512._createHelper(SHA384);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacSHA384(message, key);
    	     */
    	    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
    	}());


    	return CryptoJS.SHA384;

    }));
    });

    var sha3 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, x64Core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function (Math) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var Hasher = C_lib.Hasher;
    	    var C_x64 = C.x64;
    	    var X64Word = C_x64.Word;
    	    var C_algo = C.algo;

    	    // Constants tables
    	    var RHO_OFFSETS = [];
    	    var PI_INDEXES  = [];
    	    var ROUND_CONSTANTS = [];

    	    // Compute Constants
    	    (function () {
    	        // Compute rho offset constants
    	        var x = 1, y = 0;
    	        for (var t = 0; t < 24; t++) {
    	            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

    	            var newX = y % 5;
    	            var newY = (2 * x + 3 * y) % 5;
    	            x = newX;
    	            y = newY;
    	        }

    	        // Compute pi index constants
    	        for (var x = 0; x < 5; x++) {
    	            for (var y = 0; y < 5; y++) {
    	                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
    	            }
    	        }

    	        // Compute round constants
    	        var LFSR = 0x01;
    	        for (var i = 0; i < 24; i++) {
    	            var roundConstantMsw = 0;
    	            var roundConstantLsw = 0;

    	            for (var j = 0; j < 7; j++) {
    	                if (LFSR & 0x01) {
    	                    var bitPosition = (1 << j) - 1;
    	                    if (bitPosition < 32) {
    	                        roundConstantLsw ^= 1 << bitPosition;
    	                    } else /* if (bitPosition >= 32) */ {
    	                        roundConstantMsw ^= 1 << (bitPosition - 32);
    	                    }
    	                }

    	                // Compute next LFSR
    	                if (LFSR & 0x80) {
    	                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
    	                    LFSR = (LFSR << 1) ^ 0x71;
    	                } else {
    	                    LFSR <<= 1;
    	                }
    	            }

    	            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
    	        }
    	    }());

    	    // Reusable objects for temporary values
    	    var T = [];
    	    (function () {
    	        for (var i = 0; i < 25; i++) {
    	            T[i] = X64Word.create();
    	        }
    	    }());

    	    /**
    	     * SHA-3 hash algorithm.
    	     */
    	    var SHA3 = C_algo.SHA3 = Hasher.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {number} outputLength
    	         *   The desired number of bits in the output hash.
    	         *   Only values permitted are: 224, 256, 384, 512.
    	         *   Default: 512
    	         */
    	        cfg: Hasher.cfg.extend({
    	            outputLength: 512
    	        }),

    	        _doReset: function () {
    	            var state = this._state = [];
    	            for (var i = 0; i < 25; i++) {
    	                state[i] = new X64Word.init();
    	            }

    	            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Shortcuts
    	            var state = this._state;
    	            var nBlockSizeLanes = this.blockSize / 2;

    	            // Absorb
    	            for (var i = 0; i < nBlockSizeLanes; i++) {
    	                // Shortcuts
    	                var M2i  = M[offset + 2 * i];
    	                var M2i1 = M[offset + 2 * i + 1];

    	                // Swap endian
    	                M2i = (
    	                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
    	                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
    	                );
    	                M2i1 = (
    	                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
    	                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
    	                );

    	                // Absorb message into state
    	                var lane = state[i];
    	                lane.high ^= M2i1;
    	                lane.low  ^= M2i;
    	            }

    	            // Rounds
    	            for (var round = 0; round < 24; round++) {
    	                // Theta
    	                for (var x = 0; x < 5; x++) {
    	                    // Mix column lanes
    	                    var tMsw = 0, tLsw = 0;
    	                    for (var y = 0; y < 5; y++) {
    	                        var lane = state[x + 5 * y];
    	                        tMsw ^= lane.high;
    	                        tLsw ^= lane.low;
    	                    }

    	                    // Temporary values
    	                    var Tx = T[x];
    	                    Tx.high = tMsw;
    	                    Tx.low  = tLsw;
    	                }
    	                for (var x = 0; x < 5; x++) {
    	                    // Shortcuts
    	                    var Tx4 = T[(x + 4) % 5];
    	                    var Tx1 = T[(x + 1) % 5];
    	                    var Tx1Msw = Tx1.high;
    	                    var Tx1Lsw = Tx1.low;

    	                    // Mix surrounding columns
    	                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
    	                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
    	                    for (var y = 0; y < 5; y++) {
    	                        var lane = state[x + 5 * y];
    	                        lane.high ^= tMsw;
    	                        lane.low  ^= tLsw;
    	                    }
    	                }

    	                // Rho Pi
    	                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
    	                    var tMsw;
    	                    var tLsw;

    	                    // Shortcuts
    	                    var lane = state[laneIndex];
    	                    var laneMsw = lane.high;
    	                    var laneLsw = lane.low;
    	                    var rhoOffset = RHO_OFFSETS[laneIndex];

    	                    // Rotate lanes
    	                    if (rhoOffset < 32) {
    	                        tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
    	                        tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
    	                    } else /* if (rhoOffset >= 32) */ {
    	                        tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
    	                        tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
    	                    }

    	                    // Transpose lanes
    	                    var TPiLane = T[PI_INDEXES[laneIndex]];
    	                    TPiLane.high = tMsw;
    	                    TPiLane.low  = tLsw;
    	                }

    	                // Rho pi at x = y = 0
    	                var T0 = T[0];
    	                var state0 = state[0];
    	                T0.high = state0.high;
    	                T0.low  = state0.low;

    	                // Chi
    	                for (var x = 0; x < 5; x++) {
    	                    for (var y = 0; y < 5; y++) {
    	                        // Shortcuts
    	                        var laneIndex = x + 5 * y;
    	                        var lane = state[laneIndex];
    	                        var TLane = T[laneIndex];
    	                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
    	                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

    	                        // Mix rows
    	                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
    	                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
    	                    }
    	                }

    	                // Iota
    	                var lane = state[0];
    	                var roundConstant = ROUND_CONSTANTS[round];
    	                lane.high ^= roundConstant.high;
    	                lane.low  ^= roundConstant.low;
    	            }
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;
    	            this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;
    	            var blockSizeBits = this.blockSize * 32;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
    	            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
    	            data.sigBytes = dataWords.length * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Shortcuts
    	            var state = this._state;
    	            var outputLengthBytes = this.cfg.outputLength / 8;
    	            var outputLengthLanes = outputLengthBytes / 8;

    	            // Squeeze
    	            var hashWords = [];
    	            for (var i = 0; i < outputLengthLanes; i++) {
    	                // Shortcuts
    	                var lane = state[i];
    	                var laneMsw = lane.high;
    	                var laneLsw = lane.low;

    	                // Swap endian
    	                laneMsw = (
    	                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
    	                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
    	                );
    	                laneLsw = (
    	                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
    	                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
    	                );

    	                // Squeeze state to retrieve hash
    	                hashWords.push(laneLsw);
    	                hashWords.push(laneMsw);
    	            }

    	            // Return final computed hash
    	            return new WordArray.init(hashWords, outputLengthBytes);
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);

    	            var state = clone._state = this._state.slice(0);
    	            for (var i = 0; i < 25; i++) {
    	                state[i] = state[i].clone();
    	            }

    	            return clone;
    	        }
    	    });

    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.SHA3('message');
    	     *     var hash = CryptoJS.SHA3(wordArray);
    	     */
    	    C.SHA3 = Hasher._createHelper(SHA3);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacSHA3(message, key);
    	     */
    	    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
    	}(Math));


    	return CryptoJS.SHA3;

    }));
    });

    var ripemd160 = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/** @preserve
    	(c) 2012 by Cédric Mesnil. All rights reserved.

    	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

    	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    	*/

    	(function (Math) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var Hasher = C_lib.Hasher;
    	    var C_algo = C.algo;

    	    // Constants table
    	    var _zl = WordArray.create([
    	        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
    	        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
    	        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
    	        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
    	        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
    	    var _zr = WordArray.create([
    	        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
    	        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
    	        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
    	        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
    	        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
    	    var _sl = WordArray.create([
    	         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
    	        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
    	        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
    	          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
    	        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
    	    var _sr = WordArray.create([
    	        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
    	        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
    	        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
    	        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
    	        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

    	    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
    	    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

    	    /**
    	     * RIPEMD160 hash algorithm.
    	     */
    	    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
    	        _doReset: function () {
    	            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
    	        },

    	        _doProcessBlock: function (M, offset) {

    	            // Swap endian
    	            for (var i = 0; i < 16; i++) {
    	                // Shortcuts
    	                var offset_i = offset + i;
    	                var M_offset_i = M[offset_i];

    	                // Swap
    	                M[offset_i] = (
    	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
    	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
    	                );
    	            }
    	            // Shortcut
    	            var H  = this._hash.words;
    	            var hl = _hl.words;
    	            var hr = _hr.words;
    	            var zl = _zl.words;
    	            var zr = _zr.words;
    	            var sl = _sl.words;
    	            var sr = _sr.words;

    	            // Working variables
    	            var al, bl, cl, dl, el;
    	            var ar, br, cr, dr, er;

    	            ar = al = H[0];
    	            br = bl = H[1];
    	            cr = cl = H[2];
    	            dr = dl = H[3];
    	            er = el = H[4];
    	            // Computation
    	            var t;
    	            for (var i = 0; i < 80; i += 1) {
    	                t = (al +  M[offset+zl[i]])|0;
    	                if (i<16){
    		            t +=  f1(bl,cl,dl) + hl[0];
    	                } else if (i<32) {
    		            t +=  f2(bl,cl,dl) + hl[1];
    	                } else if (i<48) {
    		            t +=  f3(bl,cl,dl) + hl[2];
    	                } else if (i<64) {
    		            t +=  f4(bl,cl,dl) + hl[3];
    	                } else {// if (i<80) {
    		            t +=  f5(bl,cl,dl) + hl[4];
    	                }
    	                t = t|0;
    	                t =  rotl(t,sl[i]);
    	                t = (t+el)|0;
    	                al = el;
    	                el = dl;
    	                dl = rotl(cl, 10);
    	                cl = bl;
    	                bl = t;

    	                t = (ar + M[offset+zr[i]])|0;
    	                if (i<16){
    		            t +=  f5(br,cr,dr) + hr[0];
    	                } else if (i<32) {
    		            t +=  f4(br,cr,dr) + hr[1];
    	                } else if (i<48) {
    		            t +=  f3(br,cr,dr) + hr[2];
    	                } else if (i<64) {
    		            t +=  f2(br,cr,dr) + hr[3];
    	                } else {// if (i<80) {
    		            t +=  f1(br,cr,dr) + hr[4];
    	                }
    	                t = t|0;
    	                t =  rotl(t,sr[i]) ;
    	                t = (t+er)|0;
    	                ar = er;
    	                er = dr;
    	                dr = rotl(cr, 10);
    	                cr = br;
    	                br = t;
    	            }
    	            // Intermediate hash value
    	            t    = (H[1] + cl + dr)|0;
    	            H[1] = (H[2] + dl + er)|0;
    	            H[2] = (H[3] + el + ar)|0;
    	            H[3] = (H[4] + al + br)|0;
    	            H[4] = (H[0] + bl + cr)|0;
    	            H[0] =  t;
    	        },

    	        _doFinalize: function () {
    	            // Shortcuts
    	            var data = this._data;
    	            var dataWords = data.words;

    	            var nBitsTotal = this._nDataBytes * 8;
    	            var nBitsLeft = data.sigBytes * 8;

    	            // Add padding
    	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
    	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
    	                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
    	                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
    	            );
    	            data.sigBytes = (dataWords.length + 1) * 4;

    	            // Hash final blocks
    	            this._process();

    	            // Shortcuts
    	            var hash = this._hash;
    	            var H = hash.words;

    	            // Swap endian
    	            for (var i = 0; i < 5; i++) {
    	                // Shortcut
    	                var H_i = H[i];

    	                // Swap
    	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
    	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
    	            }

    	            // Return final computed hash
    	            return hash;
    	        },

    	        clone: function () {
    	            var clone = Hasher.clone.call(this);
    	            clone._hash = this._hash.clone();

    	            return clone;
    	        }
    	    });


    	    function f1(x, y, z) {
    	        return ((x) ^ (y) ^ (z));

    	    }

    	    function f2(x, y, z) {
    	        return (((x)&(y)) | ((~x)&(z)));
    	    }

    	    function f3(x, y, z) {
    	        return (((x) | (~(y))) ^ (z));
    	    }

    	    function f4(x, y, z) {
    	        return (((x) & (z)) | ((y)&(~(z))));
    	    }

    	    function f5(x, y, z) {
    	        return ((x) ^ ((y) |(~(z))));

    	    }

    	    function rotl(x,n) {
    	        return (x<<n) | (x>>>(32-n));
    	    }


    	    /**
    	     * Shortcut function to the hasher's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     *
    	     * @return {WordArray} The hash.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hash = CryptoJS.RIPEMD160('message');
    	     *     var hash = CryptoJS.RIPEMD160(wordArray);
    	     */
    	    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

    	    /**
    	     * Shortcut function to the HMAC's object interface.
    	     *
    	     * @param {WordArray|string} message The message to hash.
    	     * @param {WordArray|string} key The secret key.
    	     *
    	     * @return {WordArray} The HMAC.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
    	     */
    	    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
    	}());


    	return CryptoJS.RIPEMD160;

    }));
    });

    var hmac = createCommonjsModule(function (module, exports) {
    (function (root, factory) {
    	{
    		// CommonJS
    		module.exports = factory(core);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var Base = C_lib.Base;
    	    var C_enc = C.enc;
    	    var Utf8 = C_enc.Utf8;
    	    var C_algo = C.algo;

    	    /**
    	     * HMAC algorithm.
    	     */
    	    C_algo.HMAC = Base.extend({
    	        /**
    	         * Initializes a newly created HMAC.
    	         *
    	         * @param {Hasher} hasher The hash algorithm to use.
    	         * @param {WordArray|string} key The secret key.
    	         *
    	         * @example
    	         *
    	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
    	         */
    	        init: function (hasher, key) {
    	            // Init hasher
    	            hasher = this._hasher = new hasher.init();

    	            // Convert string to WordArray, else assume WordArray already
    	            if (typeof key == 'string') {
    	                key = Utf8.parse(key);
    	            }

    	            // Shortcuts
    	            var hasherBlockSize = hasher.blockSize;
    	            var hasherBlockSizeBytes = hasherBlockSize * 4;

    	            // Allow arbitrary length keys
    	            if (key.sigBytes > hasherBlockSizeBytes) {
    	                key = hasher.finalize(key);
    	            }

    	            // Clamp excess bits
    	            key.clamp();

    	            // Clone key for inner and outer pads
    	            var oKey = this._oKey = key.clone();
    	            var iKey = this._iKey = key.clone();

    	            // Shortcuts
    	            var oKeyWords = oKey.words;
    	            var iKeyWords = iKey.words;

    	            // XOR keys with pad constants
    	            for (var i = 0; i < hasherBlockSize; i++) {
    	                oKeyWords[i] ^= 0x5c5c5c5c;
    	                iKeyWords[i] ^= 0x36363636;
    	            }
    	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

    	            // Set initial values
    	            this.reset();
    	        },

    	        /**
    	         * Resets this HMAC to its initial state.
    	         *
    	         * @example
    	         *
    	         *     hmacHasher.reset();
    	         */
    	        reset: function () {
    	            // Shortcut
    	            var hasher = this._hasher;

    	            // Reset
    	            hasher.reset();
    	            hasher.update(this._iKey);
    	        },

    	        /**
    	         * Updates this HMAC with a message.
    	         *
    	         * @param {WordArray|string} messageUpdate The message to append.
    	         *
    	         * @return {HMAC} This HMAC instance.
    	         *
    	         * @example
    	         *
    	         *     hmacHasher.update('message');
    	         *     hmacHasher.update(wordArray);
    	         */
    	        update: function (messageUpdate) {
    	            this._hasher.update(messageUpdate);

    	            // Chainable
    	            return this;
    	        },

    	        /**
    	         * Finalizes the HMAC computation.
    	         * Note that the finalize operation is effectively a destructive, read-once operation.
    	         *
    	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
    	         *
    	         * @return {WordArray} The HMAC.
    	         *
    	         * @example
    	         *
    	         *     var hmac = hmacHasher.finalize();
    	         *     var hmac = hmacHasher.finalize('message');
    	         *     var hmac = hmacHasher.finalize(wordArray);
    	         */
    	        finalize: function (messageUpdate) {
    	            // Shortcut
    	            var hasher = this._hasher;

    	            // Compute HMAC
    	            var innerHash = hasher.finalize(messageUpdate);
    	            hasher.reset();
    	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

    	            return hmac;
    	        }
    	    });
    	}());


    }));
    });

    var pbkdf2 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, sha1, hmac);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var Base = C_lib.Base;
    	    var WordArray = C_lib.WordArray;
    	    var C_algo = C.algo;
    	    var SHA1 = C_algo.SHA1;
    	    var HMAC = C_algo.HMAC;

    	    /**
    	     * Password-Based Key Derivation Function 2 algorithm.
    	     */
    	    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
    	         * @property {Hasher} hasher The hasher to use. Default: SHA1
    	         * @property {number} iterations The number of iterations to perform. Default: 1
    	         */
    	        cfg: Base.extend({
    	            keySize: 128/32,
    	            hasher: SHA1,
    	            iterations: 1
    	        }),

    	        /**
    	         * Initializes a newly created key derivation function.
    	         *
    	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
    	         *
    	         * @example
    	         *
    	         *     var kdf = CryptoJS.algo.PBKDF2.create();
    	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
    	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
    	         */
    	        init: function (cfg) {
    	            this.cfg = this.cfg.extend(cfg);
    	        },

    	        /**
    	         * Computes the Password-Based Key Derivation Function 2.
    	         *
    	         * @param {WordArray|string} password The password.
    	         * @param {WordArray|string} salt A salt.
    	         *
    	         * @return {WordArray} The derived key.
    	         *
    	         * @example
    	         *
    	         *     var key = kdf.compute(password, salt);
    	         */
    	        compute: function (password, salt) {
    	            // Shortcut
    	            var cfg = this.cfg;

    	            // Init HMAC
    	            var hmac = HMAC.create(cfg.hasher, password);

    	            // Initial values
    	            var derivedKey = WordArray.create();
    	            var blockIndex = WordArray.create([0x00000001]);

    	            // Shortcuts
    	            var derivedKeyWords = derivedKey.words;
    	            var blockIndexWords = blockIndex.words;
    	            var keySize = cfg.keySize;
    	            var iterations = cfg.iterations;

    	            // Generate key
    	            while (derivedKeyWords.length < keySize) {
    	                var block = hmac.update(salt).finalize(blockIndex);
    	                hmac.reset();

    	                // Shortcuts
    	                var blockWords = block.words;
    	                var blockWordsLength = blockWords.length;

    	                // Iterations
    	                var intermediate = block;
    	                for (var i = 1; i < iterations; i++) {
    	                    intermediate = hmac.finalize(intermediate);
    	                    hmac.reset();

    	                    // Shortcut
    	                    var intermediateWords = intermediate.words;

    	                    // XOR intermediate with block
    	                    for (var j = 0; j < blockWordsLength; j++) {
    	                        blockWords[j] ^= intermediateWords[j];
    	                    }
    	                }

    	                derivedKey.concat(block);
    	                blockIndexWords[0]++;
    	            }
    	            derivedKey.sigBytes = keySize * 4;

    	            return derivedKey;
    	        }
    	    });

    	    /**
    	     * Computes the Password-Based Key Derivation Function 2.
    	     *
    	     * @param {WordArray|string} password The password.
    	     * @param {WordArray|string} salt A salt.
    	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
    	     *
    	     * @return {WordArray} The derived key.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var key = CryptoJS.PBKDF2(password, salt);
    	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
    	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
    	     */
    	    C.PBKDF2 = function (password, salt, cfg) {
    	        return PBKDF2.create(cfg).compute(password, salt);
    	    };
    	}());


    	return CryptoJS.PBKDF2;

    }));
    });

    var evpkdf = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, sha1, hmac);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var Base = C_lib.Base;
    	    var WordArray = C_lib.WordArray;
    	    var C_algo = C.algo;
    	    var MD5 = C_algo.MD5;

    	    /**
    	     * This key derivation function is meant to conform with EVP_BytesToKey.
    	     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
    	     */
    	    var EvpKDF = C_algo.EvpKDF = Base.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
    	         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
    	         * @property {number} iterations The number of iterations to perform. Default: 1
    	         */
    	        cfg: Base.extend({
    	            keySize: 128/32,
    	            hasher: MD5,
    	            iterations: 1
    	        }),

    	        /**
    	         * Initializes a newly created key derivation function.
    	         *
    	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
    	         *
    	         * @example
    	         *
    	         *     var kdf = CryptoJS.algo.EvpKDF.create();
    	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
    	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
    	         */
    	        init: function (cfg) {
    	            this.cfg = this.cfg.extend(cfg);
    	        },

    	        /**
    	         * Derives a key from a password.
    	         *
    	         * @param {WordArray|string} password The password.
    	         * @param {WordArray|string} salt A salt.
    	         *
    	         * @return {WordArray} The derived key.
    	         *
    	         * @example
    	         *
    	         *     var key = kdf.compute(password, salt);
    	         */
    	        compute: function (password, salt) {
    	            var block;

    	            // Shortcut
    	            var cfg = this.cfg;

    	            // Init hasher
    	            var hasher = cfg.hasher.create();

    	            // Initial values
    	            var derivedKey = WordArray.create();

    	            // Shortcuts
    	            var derivedKeyWords = derivedKey.words;
    	            var keySize = cfg.keySize;
    	            var iterations = cfg.iterations;

    	            // Generate key
    	            while (derivedKeyWords.length < keySize) {
    	                if (block) {
    	                    hasher.update(block);
    	                }
    	                block = hasher.update(password).finalize(salt);
    	                hasher.reset();

    	                // Iterations
    	                for (var i = 1; i < iterations; i++) {
    	                    block = hasher.finalize(block);
    	                    hasher.reset();
    	                }

    	                derivedKey.concat(block);
    	            }
    	            derivedKey.sigBytes = keySize * 4;

    	            return derivedKey;
    	        }
    	    });

    	    /**
    	     * Derives a key from a password.
    	     *
    	     * @param {WordArray|string} password The password.
    	     * @param {WordArray|string} salt A salt.
    	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
    	     *
    	     * @return {WordArray} The derived key.
    	     *
    	     * @static
    	     *
    	     * @example
    	     *
    	     *     var key = CryptoJS.EvpKDF(password, salt);
    	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
    	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
    	     */
    	    C.EvpKDF = function (password, salt, cfg) {
    	        return EvpKDF.create(cfg).compute(password, salt);
    	    };
    	}());


    	return CryptoJS.EvpKDF;

    }));
    });

    var cipherCore = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, evpkdf);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * Cipher core components.
    	 */
    	CryptoJS.lib.Cipher || (function (undefined$1) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var Base = C_lib.Base;
    	    var WordArray = C_lib.WordArray;
    	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    	    var C_enc = C.enc;
    	    C_enc.Utf8;
    	    var Base64 = C_enc.Base64;
    	    var C_algo = C.algo;
    	    var EvpKDF = C_algo.EvpKDF;

    	    /**
    	     * Abstract base cipher template.
    	     *
    	     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
    	     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
    	     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
    	     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
    	     */
    	    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {WordArray} iv The IV to use for this operation.
    	         */
    	        cfg: Base.extend(),

    	        /**
    	         * Creates this cipher in encryption mode.
    	         *
    	         * @param {WordArray} key The key.
    	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    	         *
    	         * @return {Cipher} A cipher instance.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
    	         */
    	        createEncryptor: function (key, cfg) {
    	            return this.create(this._ENC_XFORM_MODE, key, cfg);
    	        },

    	        /**
    	         * Creates this cipher in decryption mode.
    	         *
    	         * @param {WordArray} key The key.
    	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    	         *
    	         * @return {Cipher} A cipher instance.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
    	         */
    	        createDecryptor: function (key, cfg) {
    	            return this.create(this._DEC_XFORM_MODE, key, cfg);
    	        },

    	        /**
    	         * Initializes a newly created cipher.
    	         *
    	         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
    	         * @param {WordArray} key The key.
    	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    	         *
    	         * @example
    	         *
    	         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
    	         */
    	        init: function (xformMode, key, cfg) {
    	            // Apply config defaults
    	            this.cfg = this.cfg.extend(cfg);

    	            // Store transform mode and key
    	            this._xformMode = xformMode;
    	            this._key = key;

    	            // Set initial values
    	            this.reset();
    	        },

    	        /**
    	         * Resets this cipher to its initial state.
    	         *
    	         * @example
    	         *
    	         *     cipher.reset();
    	         */
    	        reset: function () {
    	            // Reset data buffer
    	            BufferedBlockAlgorithm.reset.call(this);

    	            // Perform concrete-cipher logic
    	            this._doReset();
    	        },

    	        /**
    	         * Adds data to be encrypted or decrypted.
    	         *
    	         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
    	         *
    	         * @return {WordArray} The data after processing.
    	         *
    	         * @example
    	         *
    	         *     var encrypted = cipher.process('data');
    	         *     var encrypted = cipher.process(wordArray);
    	         */
    	        process: function (dataUpdate) {
    	            // Append
    	            this._append(dataUpdate);

    	            // Process available blocks
    	            return this._process();
    	        },

    	        /**
    	         * Finalizes the encryption or decryption process.
    	         * Note that the finalize operation is effectively a destructive, read-once operation.
    	         *
    	         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
    	         *
    	         * @return {WordArray} The data after final processing.
    	         *
    	         * @example
    	         *
    	         *     var encrypted = cipher.finalize();
    	         *     var encrypted = cipher.finalize('data');
    	         *     var encrypted = cipher.finalize(wordArray);
    	         */
    	        finalize: function (dataUpdate) {
    	            // Final data update
    	            if (dataUpdate) {
    	                this._append(dataUpdate);
    	            }

    	            // Perform concrete-cipher logic
    	            var finalProcessedData = this._doFinalize();

    	            return finalProcessedData;
    	        },

    	        keySize: 128/32,

    	        ivSize: 128/32,

    	        _ENC_XFORM_MODE: 1,

    	        _DEC_XFORM_MODE: 2,

    	        /**
    	         * Creates shortcut functions to a cipher's object interface.
    	         *
    	         * @param {Cipher} cipher The cipher to create a helper for.
    	         *
    	         * @return {Object} An object with encrypt and decrypt shortcut functions.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
    	         */
    	        _createHelper: (function () {
    	            function selectCipherStrategy(key) {
    	                if (typeof key == 'string') {
    	                    return PasswordBasedCipher;
    	                } else {
    	                    return SerializableCipher;
    	                }
    	            }

    	            return function (cipher) {
    	                return {
    	                    encrypt: function (message, key, cfg) {
    	                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
    	                    },

    	                    decrypt: function (ciphertext, key, cfg) {
    	                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
    	                    }
    	                };
    	            };
    	        }())
    	    });

    	    /**
    	     * Abstract base stream cipher template.
    	     *
    	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
    	     */
    	    C_lib.StreamCipher = Cipher.extend({
    	        _doFinalize: function () {
    	            // Process partial blocks
    	            var finalProcessedBlocks = this._process(!!'flush');

    	            return finalProcessedBlocks;
    	        },

    	        blockSize: 1
    	    });

    	    /**
    	     * Mode namespace.
    	     */
    	    var C_mode = C.mode = {};

    	    /**
    	     * Abstract base block cipher mode template.
    	     */
    	    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
    	        /**
    	         * Creates this mode for encryption.
    	         *
    	         * @param {Cipher} cipher A block cipher instance.
    	         * @param {Array} iv The IV words.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
    	         */
    	        createEncryptor: function (cipher, iv) {
    	            return this.Encryptor.create(cipher, iv);
    	        },

    	        /**
    	         * Creates this mode for decryption.
    	         *
    	         * @param {Cipher} cipher A block cipher instance.
    	         * @param {Array} iv The IV words.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
    	         */
    	        createDecryptor: function (cipher, iv) {
    	            return this.Decryptor.create(cipher, iv);
    	        },

    	        /**
    	         * Initializes a newly created mode.
    	         *
    	         * @param {Cipher} cipher A block cipher instance.
    	         * @param {Array} iv The IV words.
    	         *
    	         * @example
    	         *
    	         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
    	         */
    	        init: function (cipher, iv) {
    	            this._cipher = cipher;
    	            this._iv = iv;
    	        }
    	    });

    	    /**
    	     * Cipher Block Chaining mode.
    	     */
    	    var CBC = C_mode.CBC = (function () {
    	        /**
    	         * Abstract base CBC mode.
    	         */
    	        var CBC = BlockCipherMode.extend();

    	        /**
    	         * CBC encryptor.
    	         */
    	        CBC.Encryptor = CBC.extend({
    	            /**
    	             * Processes the data block at offset.
    	             *
    	             * @param {Array} words The data words to operate on.
    	             * @param {number} offset The offset where the block starts.
    	             *
    	             * @example
    	             *
    	             *     mode.processBlock(data.words, offset);
    	             */
    	            processBlock: function (words, offset) {
    	                // Shortcuts
    	                var cipher = this._cipher;
    	                var blockSize = cipher.blockSize;

    	                // XOR and encrypt
    	                xorBlock.call(this, words, offset, blockSize);
    	                cipher.encryptBlock(words, offset);

    	                // Remember this block to use with next block
    	                this._prevBlock = words.slice(offset, offset + blockSize);
    	            }
    	        });

    	        /**
    	         * CBC decryptor.
    	         */
    	        CBC.Decryptor = CBC.extend({
    	            /**
    	             * Processes the data block at offset.
    	             *
    	             * @param {Array} words The data words to operate on.
    	             * @param {number} offset The offset where the block starts.
    	             *
    	             * @example
    	             *
    	             *     mode.processBlock(data.words, offset);
    	             */
    	            processBlock: function (words, offset) {
    	                // Shortcuts
    	                var cipher = this._cipher;
    	                var blockSize = cipher.blockSize;

    	                // Remember this block to use with next block
    	                var thisBlock = words.slice(offset, offset + blockSize);

    	                // Decrypt and XOR
    	                cipher.decryptBlock(words, offset);
    	                xorBlock.call(this, words, offset, blockSize);

    	                // This block becomes the previous block
    	                this._prevBlock = thisBlock;
    	            }
    	        });

    	        function xorBlock(words, offset, blockSize) {
    	            var block;

    	            // Shortcut
    	            var iv = this._iv;

    	            // Choose mixing block
    	            if (iv) {
    	                block = iv;

    	                // Remove IV for subsequent blocks
    	                this._iv = undefined$1;
    	            } else {
    	                block = this._prevBlock;
    	            }

    	            // XOR blocks
    	            for (var i = 0; i < blockSize; i++) {
    	                words[offset + i] ^= block[i];
    	            }
    	        }

    	        return CBC;
    	    }());

    	    /**
    	     * Padding namespace.
    	     */
    	    var C_pad = C.pad = {};

    	    /**
    	     * PKCS #5/7 padding strategy.
    	     */
    	    var Pkcs7 = C_pad.Pkcs7 = {
    	        /**
    	         * Pads data using the algorithm defined in PKCS #5/7.
    	         *
    	         * @param {WordArray} data The data to pad.
    	         * @param {number} blockSize The multiple that the data should be padded to.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
    	         */
    	        pad: function (data, blockSize) {
    	            // Shortcut
    	            var blockSizeBytes = blockSize * 4;

    	            // Count padding bytes
    	            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

    	            // Create padding word
    	            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

    	            // Create padding
    	            var paddingWords = [];
    	            for (var i = 0; i < nPaddingBytes; i += 4) {
    	                paddingWords.push(paddingWord);
    	            }
    	            var padding = WordArray.create(paddingWords, nPaddingBytes);

    	            // Add padding
    	            data.concat(padding);
    	        },

    	        /**
    	         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
    	         *
    	         * @param {WordArray} data The data to unpad.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
    	         */
    	        unpad: function (data) {
    	            // Get number of padding bytes from last byte
    	            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

    	            // Remove padding
    	            data.sigBytes -= nPaddingBytes;
    	        }
    	    };

    	    /**
    	     * Abstract base block cipher template.
    	     *
    	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
    	     */
    	    C_lib.BlockCipher = Cipher.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {Mode} mode The block mode to use. Default: CBC
    	         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
    	         */
    	        cfg: Cipher.cfg.extend({
    	            mode: CBC,
    	            padding: Pkcs7
    	        }),

    	        reset: function () {
    	            var modeCreator;

    	            // Reset cipher
    	            Cipher.reset.call(this);

    	            // Shortcuts
    	            var cfg = this.cfg;
    	            var iv = cfg.iv;
    	            var mode = cfg.mode;

    	            // Reset block mode
    	            if (this._xformMode == this._ENC_XFORM_MODE) {
    	                modeCreator = mode.createEncryptor;
    	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
    	                modeCreator = mode.createDecryptor;
    	                // Keep at least one block in the buffer for unpadding
    	                this._minBufferSize = 1;
    	            }

    	            if (this._mode && this._mode.__creator == modeCreator) {
    	                this._mode.init(this, iv && iv.words);
    	            } else {
    	                this._mode = modeCreator.call(mode, this, iv && iv.words);
    	                this._mode.__creator = modeCreator;
    	            }
    	        },

    	        _doProcessBlock: function (words, offset) {
    	            this._mode.processBlock(words, offset);
    	        },

    	        _doFinalize: function () {
    	            var finalProcessedBlocks;

    	            // Shortcut
    	            var padding = this.cfg.padding;

    	            // Finalize
    	            if (this._xformMode == this._ENC_XFORM_MODE) {
    	                // Pad data
    	                padding.pad(this._data, this.blockSize);

    	                // Process final blocks
    	                finalProcessedBlocks = this._process(!!'flush');
    	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
    	                // Process final blocks
    	                finalProcessedBlocks = this._process(!!'flush');

    	                // Unpad data
    	                padding.unpad(finalProcessedBlocks);
    	            }

    	            return finalProcessedBlocks;
    	        },

    	        blockSize: 128/32
    	    });

    	    /**
    	     * A collection of cipher parameters.
    	     *
    	     * @property {WordArray} ciphertext The raw ciphertext.
    	     * @property {WordArray} key The key to this ciphertext.
    	     * @property {WordArray} iv The IV used in the ciphering operation.
    	     * @property {WordArray} salt The salt used with a key derivation function.
    	     * @property {Cipher} algorithm The cipher algorithm.
    	     * @property {Mode} mode The block mode used in the ciphering operation.
    	     * @property {Padding} padding The padding scheme used in the ciphering operation.
    	     * @property {number} blockSize The block size of the cipher.
    	     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
    	     */
    	    var CipherParams = C_lib.CipherParams = Base.extend({
    	        /**
    	         * Initializes a newly created cipher params object.
    	         *
    	         * @param {Object} cipherParams An object with any of the possible cipher parameters.
    	         *
    	         * @example
    	         *
    	         *     var cipherParams = CryptoJS.lib.CipherParams.create({
    	         *         ciphertext: ciphertextWordArray,
    	         *         key: keyWordArray,
    	         *         iv: ivWordArray,
    	         *         salt: saltWordArray,
    	         *         algorithm: CryptoJS.algo.AES,
    	         *         mode: CryptoJS.mode.CBC,
    	         *         padding: CryptoJS.pad.PKCS7,
    	         *         blockSize: 4,
    	         *         formatter: CryptoJS.format.OpenSSL
    	         *     });
    	         */
    	        init: function (cipherParams) {
    	            this.mixIn(cipherParams);
    	        },

    	        /**
    	         * Converts this cipher params object to a string.
    	         *
    	         * @param {Format} formatter (Optional) The formatting strategy to use.
    	         *
    	         * @return {string} The stringified cipher params.
    	         *
    	         * @throws Error If neither the formatter nor the default formatter is set.
    	         *
    	         * @example
    	         *
    	         *     var string = cipherParams + '';
    	         *     var string = cipherParams.toString();
    	         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
    	         */
    	        toString: function (formatter) {
    	            return (formatter || this.formatter).stringify(this);
    	        }
    	    });

    	    /**
    	     * Format namespace.
    	     */
    	    var C_format = C.format = {};

    	    /**
    	     * OpenSSL formatting strategy.
    	     */
    	    var OpenSSLFormatter = C_format.OpenSSL = {
    	        /**
    	         * Converts a cipher params object to an OpenSSL-compatible string.
    	         *
    	         * @param {CipherParams} cipherParams The cipher params object.
    	         *
    	         * @return {string} The OpenSSL-compatible string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
    	         */
    	        stringify: function (cipherParams) {
    	            var wordArray;

    	            // Shortcuts
    	            var ciphertext = cipherParams.ciphertext;
    	            var salt = cipherParams.salt;

    	            // Format
    	            if (salt) {
    	                wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
    	            } else {
    	                wordArray = ciphertext;
    	            }

    	            return wordArray.toString(Base64);
    	        },

    	        /**
    	         * Converts an OpenSSL-compatible string to a cipher params object.
    	         *
    	         * @param {string} openSSLStr The OpenSSL-compatible string.
    	         *
    	         * @return {CipherParams} The cipher params object.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
    	         */
    	        parse: function (openSSLStr) {
    	            var salt;

    	            // Parse base64
    	            var ciphertext = Base64.parse(openSSLStr);

    	            // Shortcut
    	            var ciphertextWords = ciphertext.words;

    	            // Test for salt
    	            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
    	                // Extract salt
    	                salt = WordArray.create(ciphertextWords.slice(2, 4));

    	                // Remove salt from ciphertext
    	                ciphertextWords.splice(0, 4);
    	                ciphertext.sigBytes -= 16;
    	            }

    	            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
    	        }
    	    };

    	    /**
    	     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
    	     */
    	    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
    	         */
    	        cfg: Base.extend({
    	            format: OpenSSLFormatter
    	        }),

    	        /**
    	         * Encrypts a message.
    	         *
    	         * @param {Cipher} cipher The cipher algorithm to use.
    	         * @param {WordArray|string} message The message to encrypt.
    	         * @param {WordArray} key The key.
    	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    	         *
    	         * @return {CipherParams} A cipher params object.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
    	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
    	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
    	         */
    	        encrypt: function (cipher, message, key, cfg) {
    	            // Apply config defaults
    	            cfg = this.cfg.extend(cfg);

    	            // Encrypt
    	            var encryptor = cipher.createEncryptor(key, cfg);
    	            var ciphertext = encryptor.finalize(message);

    	            // Shortcut
    	            var cipherCfg = encryptor.cfg;

    	            // Create and return serializable cipher params
    	            return CipherParams.create({
    	                ciphertext: ciphertext,
    	                key: key,
    	                iv: cipherCfg.iv,
    	                algorithm: cipher,
    	                mode: cipherCfg.mode,
    	                padding: cipherCfg.padding,
    	                blockSize: cipher.blockSize,
    	                formatter: cfg.format
    	            });
    	        },

    	        /**
    	         * Decrypts serialized ciphertext.
    	         *
    	         * @param {Cipher} cipher The cipher algorithm to use.
    	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
    	         * @param {WordArray} key The key.
    	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    	         *
    	         * @return {WordArray} The plaintext.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
    	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
    	         */
    	        decrypt: function (cipher, ciphertext, key, cfg) {
    	            // Apply config defaults
    	            cfg = this.cfg.extend(cfg);

    	            // Convert string to CipherParams
    	            ciphertext = this._parse(ciphertext, cfg.format);

    	            // Decrypt
    	            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

    	            return plaintext;
    	        },

    	        /**
    	         * Converts serialized ciphertext to CipherParams,
    	         * else assumed CipherParams already and returns ciphertext unchanged.
    	         *
    	         * @param {CipherParams|string} ciphertext The ciphertext.
    	         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
    	         *
    	         * @return {CipherParams} The unserialized ciphertext.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
    	         */
    	        _parse: function (ciphertext, format) {
    	            if (typeof ciphertext == 'string') {
    	                return format.parse(ciphertext, this);
    	            } else {
    	                return ciphertext;
    	            }
    	        }
    	    });

    	    /**
    	     * Key derivation function namespace.
    	     */
    	    var C_kdf = C.kdf = {};

    	    /**
    	     * OpenSSL key derivation function.
    	     */
    	    var OpenSSLKdf = C_kdf.OpenSSL = {
    	        /**
    	         * Derives a key and IV from a password.
    	         *
    	         * @param {string} password The password to derive from.
    	         * @param {number} keySize The size in words of the key to generate.
    	         * @param {number} ivSize The size in words of the IV to generate.
    	         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
    	         *
    	         * @return {CipherParams} A cipher params object with the key, IV, and salt.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
    	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
    	         */
    	        execute: function (password, keySize, ivSize, salt) {
    	            // Generate random salt
    	            if (!salt) {
    	                salt = WordArray.random(64/8);
    	            }

    	            // Derive key and IV
    	            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

    	            // Separate key and IV
    	            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
    	            key.sigBytes = keySize * 4;

    	            // Return params
    	            return CipherParams.create({ key: key, iv: iv, salt: salt });
    	        }
    	    };

    	    /**
    	     * A serializable cipher wrapper that derives the key from a password,
    	     * and returns ciphertext as a serializable cipher params object.
    	     */
    	    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
    	         */
    	        cfg: SerializableCipher.cfg.extend({
    	            kdf: OpenSSLKdf
    	        }),

    	        /**
    	         * Encrypts a message using a password.
    	         *
    	         * @param {Cipher} cipher The cipher algorithm to use.
    	         * @param {WordArray|string} message The message to encrypt.
    	         * @param {string} password The password.
    	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    	         *
    	         * @return {CipherParams} A cipher params object.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
    	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
    	         */
    	        encrypt: function (cipher, message, password, cfg) {
    	            // Apply config defaults
    	            cfg = this.cfg.extend(cfg);

    	            // Derive key and other params
    	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

    	            // Add IV to config
    	            cfg.iv = derivedParams.iv;

    	            // Encrypt
    	            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

    	            // Mix in derived params
    	            ciphertext.mixIn(derivedParams);

    	            return ciphertext;
    	        },

    	        /**
    	         * Decrypts serialized ciphertext using a password.
    	         *
    	         * @param {Cipher} cipher The cipher algorithm to use.
    	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
    	         * @param {string} password The password.
    	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    	         *
    	         * @return {WordArray} The plaintext.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
    	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
    	         */
    	        decrypt: function (cipher, ciphertext, password, cfg) {
    	            // Apply config defaults
    	            cfg = this.cfg.extend(cfg);

    	            // Convert string to CipherParams
    	            ciphertext = this._parse(ciphertext, cfg.format);

    	            // Derive key and other params
    	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

    	            // Add IV to config
    	            cfg.iv = derivedParams.iv;

    	            // Decrypt
    	            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

    	            return plaintext;
    	        }
    	    });
    	}());


    }));
    });

    var modeCfb = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * Cipher Feedback block mode.
    	 */
    	CryptoJS.mode.CFB = (function () {
    	    var CFB = CryptoJS.lib.BlockCipherMode.extend();

    	    CFB.Encryptor = CFB.extend({
    	        processBlock: function (words, offset) {
    	            // Shortcuts
    	            var cipher = this._cipher;
    	            var blockSize = cipher.blockSize;

    	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

    	            // Remember this block to use with next block
    	            this._prevBlock = words.slice(offset, offset + blockSize);
    	        }
    	    });

    	    CFB.Decryptor = CFB.extend({
    	        processBlock: function (words, offset) {
    	            // Shortcuts
    	            var cipher = this._cipher;
    	            var blockSize = cipher.blockSize;

    	            // Remember this block to use with next block
    	            var thisBlock = words.slice(offset, offset + blockSize);

    	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

    	            // This block becomes the previous block
    	            this._prevBlock = thisBlock;
    	        }
    	    });

    	    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
    	        var keystream;

    	        // Shortcut
    	        var iv = this._iv;

    	        // Generate keystream
    	        if (iv) {
    	            keystream = iv.slice(0);

    	            // Remove IV for subsequent blocks
    	            this._iv = undefined;
    	        } else {
    	            keystream = this._prevBlock;
    	        }
    	        cipher.encryptBlock(keystream, 0);

    	        // Encrypt
    	        for (var i = 0; i < blockSize; i++) {
    	            words[offset + i] ^= keystream[i];
    	        }
    	    }

    	    return CFB;
    	}());


    	return CryptoJS.mode.CFB;

    }));
    });

    var modeCtr = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * Counter block mode.
    	 */
    	CryptoJS.mode.CTR = (function () {
    	    var CTR = CryptoJS.lib.BlockCipherMode.extend();

    	    var Encryptor = CTR.Encryptor = CTR.extend({
    	        processBlock: function (words, offset) {
    	            // Shortcuts
    	            var cipher = this._cipher;
    	            var blockSize = cipher.blockSize;
    	            var iv = this._iv;
    	            var counter = this._counter;

    	            // Generate keystream
    	            if (iv) {
    	                counter = this._counter = iv.slice(0);

    	                // Remove IV for subsequent blocks
    	                this._iv = undefined;
    	            }
    	            var keystream = counter.slice(0);
    	            cipher.encryptBlock(keystream, 0);

    	            // Increment counter
    	            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0;

    	            // Encrypt
    	            for (var i = 0; i < blockSize; i++) {
    	                words[offset + i] ^= keystream[i];
    	            }
    	        }
    	    });

    	    CTR.Decryptor = Encryptor;

    	    return CTR;
    	}());


    	return CryptoJS.mode.CTR;

    }));
    });

    var modeCtrGladman = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/** @preserve
    	 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
    	 * derived from CryptoJS.mode.CTR
    	 * Jan Hruby jhruby.web@gmail.com
    	 */
    	CryptoJS.mode.CTRGladman = (function () {
    	    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

    		function incWord(word)
    		{
    			if (((word >> 24) & 0xff) === 0xff) { //overflow
    			var b1 = (word >> 16)&0xff;
    			var b2 = (word >> 8)&0xff;
    			var b3 = word & 0xff;

    			if (b1 === 0xff) // overflow b1
    			{
    			b1 = 0;
    			if (b2 === 0xff)
    			{
    				b2 = 0;
    				if (b3 === 0xff)
    				{
    					b3 = 0;
    				}
    				else
    				{
    					++b3;
    				}
    			}
    			else
    			{
    				++b2;
    			}
    			}
    			else
    			{
    			++b1;
    			}

    			word = 0;
    			word += (b1 << 16);
    			word += (b2 << 8);
    			word += b3;
    			}
    			else
    			{
    			word += (0x01 << 24);
    			}
    			return word;
    		}

    		function incCounter(counter)
    		{
    			if ((counter[0] = incWord(counter[0])) === 0)
    			{
    				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
    				counter[1] = incWord(counter[1]);
    			}
    			return counter;
    		}

    	    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
    	        processBlock: function (words, offset) {
    	            // Shortcuts
    	            var cipher = this._cipher;
    	            var blockSize = cipher.blockSize;
    	            var iv = this._iv;
    	            var counter = this._counter;

    	            // Generate keystream
    	            if (iv) {
    	                counter = this._counter = iv.slice(0);

    	                // Remove IV for subsequent blocks
    	                this._iv = undefined;
    	            }

    				incCounter(counter);

    				var keystream = counter.slice(0);
    	            cipher.encryptBlock(keystream, 0);

    	            // Encrypt
    	            for (var i = 0; i < blockSize; i++) {
    	                words[offset + i] ^= keystream[i];
    	            }
    	        }
    	    });

    	    CTRGladman.Decryptor = Encryptor;

    	    return CTRGladman;
    	}());




    	return CryptoJS.mode.CTRGladman;

    }));
    });

    var modeOfb = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * Output Feedback block mode.
    	 */
    	CryptoJS.mode.OFB = (function () {
    	    var OFB = CryptoJS.lib.BlockCipherMode.extend();

    	    var Encryptor = OFB.Encryptor = OFB.extend({
    	        processBlock: function (words, offset) {
    	            // Shortcuts
    	            var cipher = this._cipher;
    	            var blockSize = cipher.blockSize;
    	            var iv = this._iv;
    	            var keystream = this._keystream;

    	            // Generate keystream
    	            if (iv) {
    	                keystream = this._keystream = iv.slice(0);

    	                // Remove IV for subsequent blocks
    	                this._iv = undefined;
    	            }
    	            cipher.encryptBlock(keystream, 0);

    	            // Encrypt
    	            for (var i = 0; i < blockSize; i++) {
    	                words[offset + i] ^= keystream[i];
    	            }
    	        }
    	    });

    	    OFB.Decryptor = Encryptor;

    	    return OFB;
    	}());


    	return CryptoJS.mode.OFB;

    }));
    });

    var modeEcb = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * Electronic Codebook block mode.
    	 */
    	CryptoJS.mode.ECB = (function () {
    	    var ECB = CryptoJS.lib.BlockCipherMode.extend();

    	    ECB.Encryptor = ECB.extend({
    	        processBlock: function (words, offset) {
    	            this._cipher.encryptBlock(words, offset);
    	        }
    	    });

    	    ECB.Decryptor = ECB.extend({
    	        processBlock: function (words, offset) {
    	            this._cipher.decryptBlock(words, offset);
    	        }
    	    });

    	    return ECB;
    	}());


    	return CryptoJS.mode.ECB;

    }));
    });

    var padAnsix923 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * ANSI X.923 padding strategy.
    	 */
    	CryptoJS.pad.AnsiX923 = {
    	    pad: function (data, blockSize) {
    	        // Shortcuts
    	        var dataSigBytes = data.sigBytes;
    	        var blockSizeBytes = blockSize * 4;

    	        // Count padding bytes
    	        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

    	        // Compute last byte position
    	        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

    	        // Pad
    	        data.clamp();
    	        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
    	        data.sigBytes += nPaddingBytes;
    	    },

    	    unpad: function (data) {
    	        // Get number of padding bytes from last byte
    	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

    	        // Remove padding
    	        data.sigBytes -= nPaddingBytes;
    	    }
    	};


    	return CryptoJS.pad.Ansix923;

    }));
    });

    var padIso10126 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * ISO 10126 padding strategy.
    	 */
    	CryptoJS.pad.Iso10126 = {
    	    pad: function (data, blockSize) {
    	        // Shortcut
    	        var blockSizeBytes = blockSize * 4;

    	        // Count padding bytes
    	        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

    	        // Pad
    	        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
    	             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
    	    },

    	    unpad: function (data) {
    	        // Get number of padding bytes from last byte
    	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

    	        // Remove padding
    	        data.sigBytes -= nPaddingBytes;
    	    }
    	};


    	return CryptoJS.pad.Iso10126;

    }));
    });

    var padIso97971 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * ISO/IEC 9797-1 Padding Method 2.
    	 */
    	CryptoJS.pad.Iso97971 = {
    	    pad: function (data, blockSize) {
    	        // Add 0x80 byte
    	        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

    	        // Zero pad the rest
    	        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
    	    },

    	    unpad: function (data) {
    	        // Remove zero padding
    	        CryptoJS.pad.ZeroPadding.unpad(data);

    	        // Remove one more byte -- the 0x80 byte
    	        data.sigBytes--;
    	    }
    	};


    	return CryptoJS.pad.Iso97971;

    }));
    });

    var padZeropadding = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * Zero padding strategy.
    	 */
    	CryptoJS.pad.ZeroPadding = {
    	    pad: function (data, blockSize) {
    	        // Shortcut
    	        var blockSizeBytes = blockSize * 4;

    	        // Pad
    	        data.clamp();
    	        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
    	    },

    	    unpad: function (data) {
    	        // Shortcut
    	        var dataWords = data.words;

    	        // Unpad
    	        var i = data.sigBytes - 1;
    	        for (var i = data.sigBytes - 1; i >= 0; i--) {
    	            if (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
    	                data.sigBytes = i + 1;
    	                break;
    	            }
    	        }
    	    }
    	};


    	return CryptoJS.pad.ZeroPadding;

    }));
    });

    var padNopadding = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	/**
    	 * A noop padding strategy.
    	 */
    	CryptoJS.pad.NoPadding = {
    	    pad: function () {
    	    },

    	    unpad: function () {
    	    }
    	};


    	return CryptoJS.pad.NoPadding;

    }));
    });

    var formatHex = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function (undefined$1) {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var CipherParams = C_lib.CipherParams;
    	    var C_enc = C.enc;
    	    var Hex = C_enc.Hex;
    	    var C_format = C.format;

    	    C_format.Hex = {
    	        /**
    	         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
    	         *
    	         * @param {CipherParams} cipherParams The cipher params object.
    	         *
    	         * @return {string} The hexadecimally encoded string.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
    	         */
    	        stringify: function (cipherParams) {
    	            return cipherParams.ciphertext.toString(Hex);
    	        },

    	        /**
    	         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
    	         *
    	         * @param {string} input The hexadecimally encoded string.
    	         *
    	         * @return {CipherParams} The cipher params object.
    	         *
    	         * @static
    	         *
    	         * @example
    	         *
    	         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
    	         */
    	        parse: function (input) {
    	            var ciphertext = Hex.parse(input);
    	            return CipherParams.create({ ciphertext: ciphertext });
    	        }
    	    };
    	}());


    	return CryptoJS.format.Hex;

    }));
    });

    var aes = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var BlockCipher = C_lib.BlockCipher;
    	    var C_algo = C.algo;

    	    // Lookup tables
    	    var SBOX = [];
    	    var INV_SBOX = [];
    	    var SUB_MIX_0 = [];
    	    var SUB_MIX_1 = [];
    	    var SUB_MIX_2 = [];
    	    var SUB_MIX_3 = [];
    	    var INV_SUB_MIX_0 = [];
    	    var INV_SUB_MIX_1 = [];
    	    var INV_SUB_MIX_2 = [];
    	    var INV_SUB_MIX_3 = [];

    	    // Compute lookup tables
    	    (function () {
    	        // Compute double table
    	        var d = [];
    	        for (var i = 0; i < 256; i++) {
    	            if (i < 128) {
    	                d[i] = i << 1;
    	            } else {
    	                d[i] = (i << 1) ^ 0x11b;
    	            }
    	        }

    	        // Walk GF(2^8)
    	        var x = 0;
    	        var xi = 0;
    	        for (var i = 0; i < 256; i++) {
    	            // Compute sbox
    	            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
    	            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
    	            SBOX[x] = sx;
    	            INV_SBOX[sx] = x;

    	            // Compute multiplication
    	            var x2 = d[x];
    	            var x4 = d[x2];
    	            var x8 = d[x4];

    	            // Compute sub bytes, mix columns tables
    	            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
    	            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
    	            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
    	            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
    	            SUB_MIX_3[x] = t;

    	            // Compute inv sub bytes, inv mix columns tables
    	            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
    	            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
    	            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
    	            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
    	            INV_SUB_MIX_3[sx] = t;

    	            // Compute next counter
    	            if (!x) {
    	                x = xi = 1;
    	            } else {
    	                x = x2 ^ d[d[d[x8 ^ x2]]];
    	                xi ^= d[d[xi]];
    	            }
    	        }
    	    }());

    	    // Precomputed Rcon lookup
    	    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

    	    /**
    	     * AES block cipher algorithm.
    	     */
    	    var AES = C_algo.AES = BlockCipher.extend({
    	        _doReset: function () {
    	            var t;

    	            // Skip reset of nRounds has been set before and key did not change
    	            if (this._nRounds && this._keyPriorReset === this._key) {
    	                return;
    	            }

    	            // Shortcuts
    	            var key = this._keyPriorReset = this._key;
    	            var keyWords = key.words;
    	            var keySize = key.sigBytes / 4;

    	            // Compute number of rounds
    	            var nRounds = this._nRounds = keySize + 6;

    	            // Compute number of key schedule rows
    	            var ksRows = (nRounds + 1) * 4;

    	            // Compute key schedule
    	            var keySchedule = this._keySchedule = [];
    	            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
    	                if (ksRow < keySize) {
    	                    keySchedule[ksRow] = keyWords[ksRow];
    	                } else {
    	                    t = keySchedule[ksRow - 1];

    	                    if (!(ksRow % keySize)) {
    	                        // Rot word
    	                        t = (t << 8) | (t >>> 24);

    	                        // Sub word
    	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

    	                        // Mix Rcon
    	                        t ^= RCON[(ksRow / keySize) | 0] << 24;
    	                    } else if (keySize > 6 && ksRow % keySize == 4) {
    	                        // Sub word
    	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
    	                    }

    	                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
    	                }
    	            }

    	            // Compute inv key schedule
    	            var invKeySchedule = this._invKeySchedule = [];
    	            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
    	                var ksRow = ksRows - invKsRow;

    	                if (invKsRow % 4) {
    	                    var t = keySchedule[ksRow];
    	                } else {
    	                    var t = keySchedule[ksRow - 4];
    	                }

    	                if (invKsRow < 4 || ksRow <= 4) {
    	                    invKeySchedule[invKsRow] = t;
    	                } else {
    	                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
    	                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
    	                }
    	            }
    	        },

    	        encryptBlock: function (M, offset) {
    	            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
    	        },

    	        decryptBlock: function (M, offset) {
    	            // Swap 2nd and 4th rows
    	            var t = M[offset + 1];
    	            M[offset + 1] = M[offset + 3];
    	            M[offset + 3] = t;

    	            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

    	            // Inv swap 2nd and 4th rows
    	            var t = M[offset + 1];
    	            M[offset + 1] = M[offset + 3];
    	            M[offset + 3] = t;
    	        },

    	        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
    	            // Shortcut
    	            var nRounds = this._nRounds;

    	            // Get input, add round key
    	            var s0 = M[offset]     ^ keySchedule[0];
    	            var s1 = M[offset + 1] ^ keySchedule[1];
    	            var s2 = M[offset + 2] ^ keySchedule[2];
    	            var s3 = M[offset + 3] ^ keySchedule[3];

    	            // Key schedule row counter
    	            var ksRow = 4;

    	            // Rounds
    	            for (var round = 1; round < nRounds; round++) {
    	                // Shift rows, sub bytes, mix columns, add round key
    	                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
    	                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
    	                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
    	                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

    	                // Update state
    	                s0 = t0;
    	                s1 = t1;
    	                s2 = t2;
    	                s3 = t3;
    	            }

    	            // Shift rows, sub bytes, add round key
    	            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
    	            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
    	            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
    	            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

    	            // Set output
    	            M[offset]     = t0;
    	            M[offset + 1] = t1;
    	            M[offset + 2] = t2;
    	            M[offset + 3] = t3;
    	        },

    	        keySize: 256/32
    	    });

    	    /**
    	     * Shortcut functions to the cipher's object interface.
    	     *
    	     * @example
    	     *
    	     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
    	     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
    	     */
    	    C.AES = BlockCipher._createHelper(AES);
    	}());


    	return CryptoJS.AES;

    }));
    });

    var tripledes = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var WordArray = C_lib.WordArray;
    	    var BlockCipher = C_lib.BlockCipher;
    	    var C_algo = C.algo;

    	    // Permuted Choice 1 constants
    	    var PC1 = [
    	        57, 49, 41, 33, 25, 17, 9,  1,
    	        58, 50, 42, 34, 26, 18, 10, 2,
    	        59, 51, 43, 35, 27, 19, 11, 3,
    	        60, 52, 44, 36, 63, 55, 47, 39,
    	        31, 23, 15, 7,  62, 54, 46, 38,
    	        30, 22, 14, 6,  61, 53, 45, 37,
    	        29, 21, 13, 5,  28, 20, 12, 4
    	    ];

    	    // Permuted Choice 2 constants
    	    var PC2 = [
    	        14, 17, 11, 24, 1,  5,
    	        3,  28, 15, 6,  21, 10,
    	        23, 19, 12, 4,  26, 8,
    	        16, 7,  27, 20, 13, 2,
    	        41, 52, 31, 37, 47, 55,
    	        30, 40, 51, 45, 33, 48,
    	        44, 49, 39, 56, 34, 53,
    	        46, 42, 50, 36, 29, 32
    	    ];

    	    // Cumulative bit shift constants
    	    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

    	    // SBOXes and round permutation constants
    	    var SBOX_P = [
    	        {
    	            0x0: 0x808200,
    	            0x10000000: 0x8000,
    	            0x20000000: 0x808002,
    	            0x30000000: 0x2,
    	            0x40000000: 0x200,
    	            0x50000000: 0x808202,
    	            0x60000000: 0x800202,
    	            0x70000000: 0x800000,
    	            0x80000000: 0x202,
    	            0x90000000: 0x800200,
    	            0xa0000000: 0x8200,
    	            0xb0000000: 0x808000,
    	            0xc0000000: 0x8002,
    	            0xd0000000: 0x800002,
    	            0xe0000000: 0x0,
    	            0xf0000000: 0x8202,
    	            0x8000000: 0x0,
    	            0x18000000: 0x808202,
    	            0x28000000: 0x8202,
    	            0x38000000: 0x8000,
    	            0x48000000: 0x808200,
    	            0x58000000: 0x200,
    	            0x68000000: 0x808002,
    	            0x78000000: 0x2,
    	            0x88000000: 0x800200,
    	            0x98000000: 0x8200,
    	            0xa8000000: 0x808000,
    	            0xb8000000: 0x800202,
    	            0xc8000000: 0x800002,
    	            0xd8000000: 0x8002,
    	            0xe8000000: 0x202,
    	            0xf8000000: 0x800000,
    	            0x1: 0x8000,
    	            0x10000001: 0x2,
    	            0x20000001: 0x808200,
    	            0x30000001: 0x800000,
    	            0x40000001: 0x808002,
    	            0x50000001: 0x8200,
    	            0x60000001: 0x200,
    	            0x70000001: 0x800202,
    	            0x80000001: 0x808202,
    	            0x90000001: 0x808000,
    	            0xa0000001: 0x800002,
    	            0xb0000001: 0x8202,
    	            0xc0000001: 0x202,
    	            0xd0000001: 0x800200,
    	            0xe0000001: 0x8002,
    	            0xf0000001: 0x0,
    	            0x8000001: 0x808202,
    	            0x18000001: 0x808000,
    	            0x28000001: 0x800000,
    	            0x38000001: 0x200,
    	            0x48000001: 0x8000,
    	            0x58000001: 0x800002,
    	            0x68000001: 0x2,
    	            0x78000001: 0x8202,
    	            0x88000001: 0x8002,
    	            0x98000001: 0x800202,
    	            0xa8000001: 0x202,
    	            0xb8000001: 0x808200,
    	            0xc8000001: 0x800200,
    	            0xd8000001: 0x0,
    	            0xe8000001: 0x8200,
    	            0xf8000001: 0x808002
    	        },
    	        {
    	            0x0: 0x40084010,
    	            0x1000000: 0x4000,
    	            0x2000000: 0x80000,
    	            0x3000000: 0x40080010,
    	            0x4000000: 0x40000010,
    	            0x5000000: 0x40084000,
    	            0x6000000: 0x40004000,
    	            0x7000000: 0x10,
    	            0x8000000: 0x84000,
    	            0x9000000: 0x40004010,
    	            0xa000000: 0x40000000,
    	            0xb000000: 0x84010,
    	            0xc000000: 0x80010,
    	            0xd000000: 0x0,
    	            0xe000000: 0x4010,
    	            0xf000000: 0x40080000,
    	            0x800000: 0x40004000,
    	            0x1800000: 0x84010,
    	            0x2800000: 0x10,
    	            0x3800000: 0x40004010,
    	            0x4800000: 0x40084010,
    	            0x5800000: 0x40000000,
    	            0x6800000: 0x80000,
    	            0x7800000: 0x40080010,
    	            0x8800000: 0x80010,
    	            0x9800000: 0x0,
    	            0xa800000: 0x4000,
    	            0xb800000: 0x40080000,
    	            0xc800000: 0x40000010,
    	            0xd800000: 0x84000,
    	            0xe800000: 0x40084000,
    	            0xf800000: 0x4010,
    	            0x10000000: 0x0,
    	            0x11000000: 0x40080010,
    	            0x12000000: 0x40004010,
    	            0x13000000: 0x40084000,
    	            0x14000000: 0x40080000,
    	            0x15000000: 0x10,
    	            0x16000000: 0x84010,
    	            0x17000000: 0x4000,
    	            0x18000000: 0x4010,
    	            0x19000000: 0x80000,
    	            0x1a000000: 0x80010,
    	            0x1b000000: 0x40000010,
    	            0x1c000000: 0x84000,
    	            0x1d000000: 0x40004000,
    	            0x1e000000: 0x40000000,
    	            0x1f000000: 0x40084010,
    	            0x10800000: 0x84010,
    	            0x11800000: 0x80000,
    	            0x12800000: 0x40080000,
    	            0x13800000: 0x4000,
    	            0x14800000: 0x40004000,
    	            0x15800000: 0x40084010,
    	            0x16800000: 0x10,
    	            0x17800000: 0x40000000,
    	            0x18800000: 0x40084000,
    	            0x19800000: 0x40000010,
    	            0x1a800000: 0x40004010,
    	            0x1b800000: 0x80010,
    	            0x1c800000: 0x0,
    	            0x1d800000: 0x4010,
    	            0x1e800000: 0x40080010,
    	            0x1f800000: 0x84000
    	        },
    	        {
    	            0x0: 0x104,
    	            0x100000: 0x0,
    	            0x200000: 0x4000100,
    	            0x300000: 0x10104,
    	            0x400000: 0x10004,
    	            0x500000: 0x4000004,
    	            0x600000: 0x4010104,
    	            0x700000: 0x4010000,
    	            0x800000: 0x4000000,
    	            0x900000: 0x4010100,
    	            0xa00000: 0x10100,
    	            0xb00000: 0x4010004,
    	            0xc00000: 0x4000104,
    	            0xd00000: 0x10000,
    	            0xe00000: 0x4,
    	            0xf00000: 0x100,
    	            0x80000: 0x4010100,
    	            0x180000: 0x4010004,
    	            0x280000: 0x0,
    	            0x380000: 0x4000100,
    	            0x480000: 0x4000004,
    	            0x580000: 0x10000,
    	            0x680000: 0x10004,
    	            0x780000: 0x104,
    	            0x880000: 0x4,
    	            0x980000: 0x100,
    	            0xa80000: 0x4010000,
    	            0xb80000: 0x10104,
    	            0xc80000: 0x10100,
    	            0xd80000: 0x4000104,
    	            0xe80000: 0x4010104,
    	            0xf80000: 0x4000000,
    	            0x1000000: 0x4010100,
    	            0x1100000: 0x10004,
    	            0x1200000: 0x10000,
    	            0x1300000: 0x4000100,
    	            0x1400000: 0x100,
    	            0x1500000: 0x4010104,
    	            0x1600000: 0x4000004,
    	            0x1700000: 0x0,
    	            0x1800000: 0x4000104,
    	            0x1900000: 0x4000000,
    	            0x1a00000: 0x4,
    	            0x1b00000: 0x10100,
    	            0x1c00000: 0x4010000,
    	            0x1d00000: 0x104,
    	            0x1e00000: 0x10104,
    	            0x1f00000: 0x4010004,
    	            0x1080000: 0x4000000,
    	            0x1180000: 0x104,
    	            0x1280000: 0x4010100,
    	            0x1380000: 0x0,
    	            0x1480000: 0x10004,
    	            0x1580000: 0x4000100,
    	            0x1680000: 0x100,
    	            0x1780000: 0x4010004,
    	            0x1880000: 0x10000,
    	            0x1980000: 0x4010104,
    	            0x1a80000: 0x10104,
    	            0x1b80000: 0x4000004,
    	            0x1c80000: 0x4000104,
    	            0x1d80000: 0x4010000,
    	            0x1e80000: 0x4,
    	            0x1f80000: 0x10100
    	        },
    	        {
    	            0x0: 0x80401000,
    	            0x10000: 0x80001040,
    	            0x20000: 0x401040,
    	            0x30000: 0x80400000,
    	            0x40000: 0x0,
    	            0x50000: 0x401000,
    	            0x60000: 0x80000040,
    	            0x70000: 0x400040,
    	            0x80000: 0x80000000,
    	            0x90000: 0x400000,
    	            0xa0000: 0x40,
    	            0xb0000: 0x80001000,
    	            0xc0000: 0x80400040,
    	            0xd0000: 0x1040,
    	            0xe0000: 0x1000,
    	            0xf0000: 0x80401040,
    	            0x8000: 0x80001040,
    	            0x18000: 0x40,
    	            0x28000: 0x80400040,
    	            0x38000: 0x80001000,
    	            0x48000: 0x401000,
    	            0x58000: 0x80401040,
    	            0x68000: 0x0,
    	            0x78000: 0x80400000,
    	            0x88000: 0x1000,
    	            0x98000: 0x80401000,
    	            0xa8000: 0x400000,
    	            0xb8000: 0x1040,
    	            0xc8000: 0x80000000,
    	            0xd8000: 0x400040,
    	            0xe8000: 0x401040,
    	            0xf8000: 0x80000040,
    	            0x100000: 0x400040,
    	            0x110000: 0x401000,
    	            0x120000: 0x80000040,
    	            0x130000: 0x0,
    	            0x140000: 0x1040,
    	            0x150000: 0x80400040,
    	            0x160000: 0x80401000,
    	            0x170000: 0x80001040,
    	            0x180000: 0x80401040,
    	            0x190000: 0x80000000,
    	            0x1a0000: 0x80400000,
    	            0x1b0000: 0x401040,
    	            0x1c0000: 0x80001000,
    	            0x1d0000: 0x400000,
    	            0x1e0000: 0x40,
    	            0x1f0000: 0x1000,
    	            0x108000: 0x80400000,
    	            0x118000: 0x80401040,
    	            0x128000: 0x0,
    	            0x138000: 0x401000,
    	            0x148000: 0x400040,
    	            0x158000: 0x80000000,
    	            0x168000: 0x80001040,
    	            0x178000: 0x40,
    	            0x188000: 0x80000040,
    	            0x198000: 0x1000,
    	            0x1a8000: 0x80001000,
    	            0x1b8000: 0x80400040,
    	            0x1c8000: 0x1040,
    	            0x1d8000: 0x80401000,
    	            0x1e8000: 0x400000,
    	            0x1f8000: 0x401040
    	        },
    	        {
    	            0x0: 0x80,
    	            0x1000: 0x1040000,
    	            0x2000: 0x40000,
    	            0x3000: 0x20000000,
    	            0x4000: 0x20040080,
    	            0x5000: 0x1000080,
    	            0x6000: 0x21000080,
    	            0x7000: 0x40080,
    	            0x8000: 0x1000000,
    	            0x9000: 0x20040000,
    	            0xa000: 0x20000080,
    	            0xb000: 0x21040080,
    	            0xc000: 0x21040000,
    	            0xd000: 0x0,
    	            0xe000: 0x1040080,
    	            0xf000: 0x21000000,
    	            0x800: 0x1040080,
    	            0x1800: 0x21000080,
    	            0x2800: 0x80,
    	            0x3800: 0x1040000,
    	            0x4800: 0x40000,
    	            0x5800: 0x20040080,
    	            0x6800: 0x21040000,
    	            0x7800: 0x20000000,
    	            0x8800: 0x20040000,
    	            0x9800: 0x0,
    	            0xa800: 0x21040080,
    	            0xb800: 0x1000080,
    	            0xc800: 0x20000080,
    	            0xd800: 0x21000000,
    	            0xe800: 0x1000000,
    	            0xf800: 0x40080,
    	            0x10000: 0x40000,
    	            0x11000: 0x80,
    	            0x12000: 0x20000000,
    	            0x13000: 0x21000080,
    	            0x14000: 0x1000080,
    	            0x15000: 0x21040000,
    	            0x16000: 0x20040080,
    	            0x17000: 0x1000000,
    	            0x18000: 0x21040080,
    	            0x19000: 0x21000000,
    	            0x1a000: 0x1040000,
    	            0x1b000: 0x20040000,
    	            0x1c000: 0x40080,
    	            0x1d000: 0x20000080,
    	            0x1e000: 0x0,
    	            0x1f000: 0x1040080,
    	            0x10800: 0x21000080,
    	            0x11800: 0x1000000,
    	            0x12800: 0x1040000,
    	            0x13800: 0x20040080,
    	            0x14800: 0x20000000,
    	            0x15800: 0x1040080,
    	            0x16800: 0x80,
    	            0x17800: 0x21040000,
    	            0x18800: 0x40080,
    	            0x19800: 0x21040080,
    	            0x1a800: 0x0,
    	            0x1b800: 0x21000000,
    	            0x1c800: 0x1000080,
    	            0x1d800: 0x40000,
    	            0x1e800: 0x20040000,
    	            0x1f800: 0x20000080
    	        },
    	        {
    	            0x0: 0x10000008,
    	            0x100: 0x2000,
    	            0x200: 0x10200000,
    	            0x300: 0x10202008,
    	            0x400: 0x10002000,
    	            0x500: 0x200000,
    	            0x600: 0x200008,
    	            0x700: 0x10000000,
    	            0x800: 0x0,
    	            0x900: 0x10002008,
    	            0xa00: 0x202000,
    	            0xb00: 0x8,
    	            0xc00: 0x10200008,
    	            0xd00: 0x202008,
    	            0xe00: 0x2008,
    	            0xf00: 0x10202000,
    	            0x80: 0x10200000,
    	            0x180: 0x10202008,
    	            0x280: 0x8,
    	            0x380: 0x200000,
    	            0x480: 0x202008,
    	            0x580: 0x10000008,
    	            0x680: 0x10002000,
    	            0x780: 0x2008,
    	            0x880: 0x200008,
    	            0x980: 0x2000,
    	            0xa80: 0x10002008,
    	            0xb80: 0x10200008,
    	            0xc80: 0x0,
    	            0xd80: 0x10202000,
    	            0xe80: 0x202000,
    	            0xf80: 0x10000000,
    	            0x1000: 0x10002000,
    	            0x1100: 0x10200008,
    	            0x1200: 0x10202008,
    	            0x1300: 0x2008,
    	            0x1400: 0x200000,
    	            0x1500: 0x10000000,
    	            0x1600: 0x10000008,
    	            0x1700: 0x202000,
    	            0x1800: 0x202008,
    	            0x1900: 0x0,
    	            0x1a00: 0x8,
    	            0x1b00: 0x10200000,
    	            0x1c00: 0x2000,
    	            0x1d00: 0x10002008,
    	            0x1e00: 0x10202000,
    	            0x1f00: 0x200008,
    	            0x1080: 0x8,
    	            0x1180: 0x202000,
    	            0x1280: 0x200000,
    	            0x1380: 0x10000008,
    	            0x1480: 0x10002000,
    	            0x1580: 0x2008,
    	            0x1680: 0x10202008,
    	            0x1780: 0x10200000,
    	            0x1880: 0x10202000,
    	            0x1980: 0x10200008,
    	            0x1a80: 0x2000,
    	            0x1b80: 0x202008,
    	            0x1c80: 0x200008,
    	            0x1d80: 0x0,
    	            0x1e80: 0x10000000,
    	            0x1f80: 0x10002008
    	        },
    	        {
    	            0x0: 0x100000,
    	            0x10: 0x2000401,
    	            0x20: 0x400,
    	            0x30: 0x100401,
    	            0x40: 0x2100401,
    	            0x50: 0x0,
    	            0x60: 0x1,
    	            0x70: 0x2100001,
    	            0x80: 0x2000400,
    	            0x90: 0x100001,
    	            0xa0: 0x2000001,
    	            0xb0: 0x2100400,
    	            0xc0: 0x2100000,
    	            0xd0: 0x401,
    	            0xe0: 0x100400,
    	            0xf0: 0x2000000,
    	            0x8: 0x2100001,
    	            0x18: 0x0,
    	            0x28: 0x2000401,
    	            0x38: 0x2100400,
    	            0x48: 0x100000,
    	            0x58: 0x2000001,
    	            0x68: 0x2000000,
    	            0x78: 0x401,
    	            0x88: 0x100401,
    	            0x98: 0x2000400,
    	            0xa8: 0x2100000,
    	            0xb8: 0x100001,
    	            0xc8: 0x400,
    	            0xd8: 0x2100401,
    	            0xe8: 0x1,
    	            0xf8: 0x100400,
    	            0x100: 0x2000000,
    	            0x110: 0x100000,
    	            0x120: 0x2000401,
    	            0x130: 0x2100001,
    	            0x140: 0x100001,
    	            0x150: 0x2000400,
    	            0x160: 0x2100400,
    	            0x170: 0x100401,
    	            0x180: 0x401,
    	            0x190: 0x2100401,
    	            0x1a0: 0x100400,
    	            0x1b0: 0x1,
    	            0x1c0: 0x0,
    	            0x1d0: 0x2100000,
    	            0x1e0: 0x2000001,
    	            0x1f0: 0x400,
    	            0x108: 0x100400,
    	            0x118: 0x2000401,
    	            0x128: 0x2100001,
    	            0x138: 0x1,
    	            0x148: 0x2000000,
    	            0x158: 0x100000,
    	            0x168: 0x401,
    	            0x178: 0x2100400,
    	            0x188: 0x2000001,
    	            0x198: 0x2100000,
    	            0x1a8: 0x0,
    	            0x1b8: 0x2100401,
    	            0x1c8: 0x100401,
    	            0x1d8: 0x400,
    	            0x1e8: 0x2000400,
    	            0x1f8: 0x100001
    	        },
    	        {
    	            0x0: 0x8000820,
    	            0x1: 0x20000,
    	            0x2: 0x8000000,
    	            0x3: 0x20,
    	            0x4: 0x20020,
    	            0x5: 0x8020820,
    	            0x6: 0x8020800,
    	            0x7: 0x800,
    	            0x8: 0x8020000,
    	            0x9: 0x8000800,
    	            0xa: 0x20800,
    	            0xb: 0x8020020,
    	            0xc: 0x820,
    	            0xd: 0x0,
    	            0xe: 0x8000020,
    	            0xf: 0x20820,
    	            0x80000000: 0x800,
    	            0x80000001: 0x8020820,
    	            0x80000002: 0x8000820,
    	            0x80000003: 0x8000000,
    	            0x80000004: 0x8020000,
    	            0x80000005: 0x20800,
    	            0x80000006: 0x20820,
    	            0x80000007: 0x20,
    	            0x80000008: 0x8000020,
    	            0x80000009: 0x820,
    	            0x8000000a: 0x20020,
    	            0x8000000b: 0x8020800,
    	            0x8000000c: 0x0,
    	            0x8000000d: 0x8020020,
    	            0x8000000e: 0x8000800,
    	            0x8000000f: 0x20000,
    	            0x10: 0x20820,
    	            0x11: 0x8020800,
    	            0x12: 0x20,
    	            0x13: 0x800,
    	            0x14: 0x8000800,
    	            0x15: 0x8000020,
    	            0x16: 0x8020020,
    	            0x17: 0x20000,
    	            0x18: 0x0,
    	            0x19: 0x20020,
    	            0x1a: 0x8020000,
    	            0x1b: 0x8000820,
    	            0x1c: 0x8020820,
    	            0x1d: 0x20800,
    	            0x1e: 0x820,
    	            0x1f: 0x8000000,
    	            0x80000010: 0x20000,
    	            0x80000011: 0x800,
    	            0x80000012: 0x8020020,
    	            0x80000013: 0x20820,
    	            0x80000014: 0x20,
    	            0x80000015: 0x8020000,
    	            0x80000016: 0x8000000,
    	            0x80000017: 0x8000820,
    	            0x80000018: 0x8020820,
    	            0x80000019: 0x8000020,
    	            0x8000001a: 0x8000800,
    	            0x8000001b: 0x0,
    	            0x8000001c: 0x20800,
    	            0x8000001d: 0x820,
    	            0x8000001e: 0x20020,
    	            0x8000001f: 0x8020800
    	        }
    	    ];

    	    // Masks that select the SBOX input
    	    var SBOX_MASK = [
    	        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
    	        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
    	    ];

    	    /**
    	     * DES block cipher algorithm.
    	     */
    	    var DES = C_algo.DES = BlockCipher.extend({
    	        _doReset: function () {
    	            // Shortcuts
    	            var key = this._key;
    	            var keyWords = key.words;

    	            // Select 56 bits according to PC1
    	            var keyBits = [];
    	            for (var i = 0; i < 56; i++) {
    	                var keyBitPos = PC1[i] - 1;
    	                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
    	            }

    	            // Assemble 16 subkeys
    	            var subKeys = this._subKeys = [];
    	            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
    	                // Create subkey
    	                var subKey = subKeys[nSubKey] = [];

    	                // Shortcut
    	                var bitShift = BIT_SHIFTS[nSubKey];

    	                // Select 48 bits according to PC2
    	                for (var i = 0; i < 24; i++) {
    	                    // Select from the left 28 key bits
    	                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

    	                    // Select from the right 28 key bits
    	                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
    	                }

    	                // Since each subkey is applied to an expanded 32-bit input,
    	                // the subkey can be broken into 8 values scaled to 32-bits,
    	                // which allows the key to be used without expansion
    	                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
    	                for (var i = 1; i < 7; i++) {
    	                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
    	                }
    	                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
    	            }

    	            // Compute inverse subkeys
    	            var invSubKeys = this._invSubKeys = [];
    	            for (var i = 0; i < 16; i++) {
    	                invSubKeys[i] = subKeys[15 - i];
    	            }
    	        },

    	        encryptBlock: function (M, offset) {
    	            this._doCryptBlock(M, offset, this._subKeys);
    	        },

    	        decryptBlock: function (M, offset) {
    	            this._doCryptBlock(M, offset, this._invSubKeys);
    	        },

    	        _doCryptBlock: function (M, offset, subKeys) {
    	            // Get input
    	            this._lBlock = M[offset];
    	            this._rBlock = M[offset + 1];

    	            // Initial permutation
    	            exchangeLR.call(this, 4,  0x0f0f0f0f);
    	            exchangeLR.call(this, 16, 0x0000ffff);
    	            exchangeRL.call(this, 2,  0x33333333);
    	            exchangeRL.call(this, 8,  0x00ff00ff);
    	            exchangeLR.call(this, 1,  0x55555555);

    	            // Rounds
    	            for (var round = 0; round < 16; round++) {
    	                // Shortcuts
    	                var subKey = subKeys[round];
    	                var lBlock = this._lBlock;
    	                var rBlock = this._rBlock;

    	                // Feistel function
    	                var f = 0;
    	                for (var i = 0; i < 8; i++) {
    	                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
    	                }
    	                this._lBlock = rBlock;
    	                this._rBlock = lBlock ^ f;
    	            }

    	            // Undo swap from last round
    	            var t = this._lBlock;
    	            this._lBlock = this._rBlock;
    	            this._rBlock = t;

    	            // Final permutation
    	            exchangeLR.call(this, 1,  0x55555555);
    	            exchangeRL.call(this, 8,  0x00ff00ff);
    	            exchangeRL.call(this, 2,  0x33333333);
    	            exchangeLR.call(this, 16, 0x0000ffff);
    	            exchangeLR.call(this, 4,  0x0f0f0f0f);

    	            // Set output
    	            M[offset] = this._lBlock;
    	            M[offset + 1] = this._rBlock;
    	        },

    	        keySize: 64/32,

    	        ivSize: 64/32,

    	        blockSize: 64/32
    	    });

    	    // Swap bits across the left and right words
    	    function exchangeLR(offset, mask) {
    	        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
    	        this._rBlock ^= t;
    	        this._lBlock ^= t << offset;
    	    }

    	    function exchangeRL(offset, mask) {
    	        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
    	        this._lBlock ^= t;
    	        this._rBlock ^= t << offset;
    	    }

    	    /**
    	     * Shortcut functions to the cipher's object interface.
    	     *
    	     * @example
    	     *
    	     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
    	     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
    	     */
    	    C.DES = BlockCipher._createHelper(DES);

    	    /**
    	     * Triple-DES block cipher algorithm.
    	     */
    	    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
    	        _doReset: function () {
    	            // Shortcuts
    	            var key = this._key;
    	            var keyWords = key.words;
    	            // Make sure the key length is valid (64, 128 or >= 192 bit)
    	            if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
    	                throw new Error('Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.');
    	            }

    	            // Extend the key according to the keying options defined in 3DES standard
    	            var key1 = keyWords.slice(0, 2);
    	            var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
    	            var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);

    	            // Create DES instances
    	            this._des1 = DES.createEncryptor(WordArray.create(key1));
    	            this._des2 = DES.createEncryptor(WordArray.create(key2));
    	            this._des3 = DES.createEncryptor(WordArray.create(key3));
    	        },

    	        encryptBlock: function (M, offset) {
    	            this._des1.encryptBlock(M, offset);
    	            this._des2.decryptBlock(M, offset);
    	            this._des3.encryptBlock(M, offset);
    	        },

    	        decryptBlock: function (M, offset) {
    	            this._des3.decryptBlock(M, offset);
    	            this._des2.encryptBlock(M, offset);
    	            this._des1.decryptBlock(M, offset);
    	        },

    	        keySize: 192/32,

    	        ivSize: 64/32,

    	        blockSize: 64/32
    	    });

    	    /**
    	     * Shortcut functions to the cipher's object interface.
    	     *
    	     * @example
    	     *
    	     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
    	     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
    	     */
    	    C.TripleDES = BlockCipher._createHelper(TripleDES);
    	}());


    	return CryptoJS.TripleDES;

    }));
    });

    var rc4 = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var StreamCipher = C_lib.StreamCipher;
    	    var C_algo = C.algo;

    	    /**
    	     * RC4 stream cipher algorithm.
    	     */
    	    var RC4 = C_algo.RC4 = StreamCipher.extend({
    	        _doReset: function () {
    	            // Shortcuts
    	            var key = this._key;
    	            var keyWords = key.words;
    	            var keySigBytes = key.sigBytes;

    	            // Init sbox
    	            var S = this._S = [];
    	            for (var i = 0; i < 256; i++) {
    	                S[i] = i;
    	            }

    	            // Key setup
    	            for (var i = 0, j = 0; i < 256; i++) {
    	                var keyByteIndex = i % keySigBytes;
    	                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

    	                j = (j + S[i] + keyByte) % 256;

    	                // Swap
    	                var t = S[i];
    	                S[i] = S[j];
    	                S[j] = t;
    	            }

    	            // Counters
    	            this._i = this._j = 0;
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            M[offset] ^= generateKeystreamWord.call(this);
    	        },

    	        keySize: 256/32,

    	        ivSize: 0
    	    });

    	    function generateKeystreamWord() {
    	        // Shortcuts
    	        var S = this._S;
    	        var i = this._i;
    	        var j = this._j;

    	        // Generate keystream word
    	        var keystreamWord = 0;
    	        for (var n = 0; n < 4; n++) {
    	            i = (i + 1) % 256;
    	            j = (j + S[i]) % 256;

    	            // Swap
    	            var t = S[i];
    	            S[i] = S[j];
    	            S[j] = t;

    	            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
    	        }

    	        // Update counters
    	        this._i = i;
    	        this._j = j;

    	        return keystreamWord;
    	    }

    	    /**
    	     * Shortcut functions to the cipher's object interface.
    	     *
    	     * @example
    	     *
    	     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
    	     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
    	     */
    	    C.RC4 = StreamCipher._createHelper(RC4);

    	    /**
    	     * Modified RC4 stream cipher algorithm.
    	     */
    	    var RC4Drop = C_algo.RC4Drop = RC4.extend({
    	        /**
    	         * Configuration options.
    	         *
    	         * @property {number} drop The number of keystream words to drop. Default 192
    	         */
    	        cfg: RC4.cfg.extend({
    	            drop: 192
    	        }),

    	        _doReset: function () {
    	            RC4._doReset.call(this);

    	            // Drop
    	            for (var i = this.cfg.drop; i > 0; i--) {
    	                generateKeystreamWord.call(this);
    	            }
    	        }
    	    });

    	    /**
    	     * Shortcut functions to the cipher's object interface.
    	     *
    	     * @example
    	     *
    	     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
    	     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
    	     */
    	    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
    	}());


    	return CryptoJS.RC4;

    }));
    });

    var rabbit = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var StreamCipher = C_lib.StreamCipher;
    	    var C_algo = C.algo;

    	    // Reusable objects
    	    var S  = [];
    	    var C_ = [];
    	    var G  = [];

    	    /**
    	     * Rabbit stream cipher algorithm
    	     */
    	    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
    	        _doReset: function () {
    	            // Shortcuts
    	            var K = this._key.words;
    	            var iv = this.cfg.iv;

    	            // Swap endian
    	            for (var i = 0; i < 4; i++) {
    	                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
    	                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
    	            }

    	            // Generate initial state values
    	            var X = this._X = [
    	                K[0], (K[3] << 16) | (K[2] >>> 16),
    	                K[1], (K[0] << 16) | (K[3] >>> 16),
    	                K[2], (K[1] << 16) | (K[0] >>> 16),
    	                K[3], (K[2] << 16) | (K[1] >>> 16)
    	            ];

    	            // Generate initial counter values
    	            var C = this._C = [
    	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
    	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
    	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
    	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
    	            ];

    	            // Carry bit
    	            this._b = 0;

    	            // Iterate the system four times
    	            for (var i = 0; i < 4; i++) {
    	                nextState.call(this);
    	            }

    	            // Modify the counters
    	            for (var i = 0; i < 8; i++) {
    	                C[i] ^= X[(i + 4) & 7];
    	            }

    	            // IV setup
    	            if (iv) {
    	                // Shortcuts
    	                var IV = iv.words;
    	                var IV_0 = IV[0];
    	                var IV_1 = IV[1];

    	                // Generate four subvectors
    	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
    	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
    	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
    	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

    	                // Modify counter values
    	                C[0] ^= i0;
    	                C[1] ^= i1;
    	                C[2] ^= i2;
    	                C[3] ^= i3;
    	                C[4] ^= i0;
    	                C[5] ^= i1;
    	                C[6] ^= i2;
    	                C[7] ^= i3;

    	                // Iterate the system four times
    	                for (var i = 0; i < 4; i++) {
    	                    nextState.call(this);
    	                }
    	            }
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Shortcut
    	            var X = this._X;

    	            // Iterate the system
    	            nextState.call(this);

    	            // Generate four keystream words
    	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
    	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
    	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
    	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

    	            for (var i = 0; i < 4; i++) {
    	                // Swap endian
    	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
    	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

    	                // Encrypt
    	                M[offset + i] ^= S[i];
    	            }
    	        },

    	        blockSize: 128/32,

    	        ivSize: 64/32
    	    });

    	    function nextState() {
    	        // Shortcuts
    	        var X = this._X;
    	        var C = this._C;

    	        // Save old counter values
    	        for (var i = 0; i < 8; i++) {
    	            C_[i] = C[i];
    	        }

    	        // Calculate new counter values
    	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
    	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
    	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
    	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
    	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
    	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
    	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
    	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
    	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

    	        // Calculate the g-values
    	        for (var i = 0; i < 8; i++) {
    	            var gx = X[i] + C[i];

    	            // Construct high and low argument for squaring
    	            var ga = gx & 0xffff;
    	            var gb = gx >>> 16;

    	            // Calculate high and low result of squaring
    	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
    	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

    	            // High XOR low
    	            G[i] = gh ^ gl;
    	        }

    	        // Calculate new state values
    	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
    	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
    	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
    	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
    	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
    	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
    	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
    	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
    	    }

    	    /**
    	     * Shortcut functions to the cipher's object interface.
    	     *
    	     * @example
    	     *
    	     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
    	     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
    	     */
    	    C.Rabbit = StreamCipher._createHelper(Rabbit);
    	}());


    	return CryptoJS.Rabbit;

    }));
    });

    var rabbitLegacy = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, encBase64, md5, evpkdf, cipherCore);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	(function () {
    	    // Shortcuts
    	    var C = CryptoJS;
    	    var C_lib = C.lib;
    	    var StreamCipher = C_lib.StreamCipher;
    	    var C_algo = C.algo;

    	    // Reusable objects
    	    var S  = [];
    	    var C_ = [];
    	    var G  = [];

    	    /**
    	     * Rabbit stream cipher algorithm.
    	     *
    	     * This is a legacy version that neglected to convert the key to little-endian.
    	     * This error doesn't affect the cipher's security,
    	     * but it does affect its compatibility with other implementations.
    	     */
    	    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
    	        _doReset: function () {
    	            // Shortcuts
    	            var K = this._key.words;
    	            var iv = this.cfg.iv;

    	            // Generate initial state values
    	            var X = this._X = [
    	                K[0], (K[3] << 16) | (K[2] >>> 16),
    	                K[1], (K[0] << 16) | (K[3] >>> 16),
    	                K[2], (K[1] << 16) | (K[0] >>> 16),
    	                K[3], (K[2] << 16) | (K[1] >>> 16)
    	            ];

    	            // Generate initial counter values
    	            var C = this._C = [
    	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
    	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
    	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
    	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
    	            ];

    	            // Carry bit
    	            this._b = 0;

    	            // Iterate the system four times
    	            for (var i = 0; i < 4; i++) {
    	                nextState.call(this);
    	            }

    	            // Modify the counters
    	            for (var i = 0; i < 8; i++) {
    	                C[i] ^= X[(i + 4) & 7];
    	            }

    	            // IV setup
    	            if (iv) {
    	                // Shortcuts
    	                var IV = iv.words;
    	                var IV_0 = IV[0];
    	                var IV_1 = IV[1];

    	                // Generate four subvectors
    	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
    	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
    	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
    	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

    	                // Modify counter values
    	                C[0] ^= i0;
    	                C[1] ^= i1;
    	                C[2] ^= i2;
    	                C[3] ^= i3;
    	                C[4] ^= i0;
    	                C[5] ^= i1;
    	                C[6] ^= i2;
    	                C[7] ^= i3;

    	                // Iterate the system four times
    	                for (var i = 0; i < 4; i++) {
    	                    nextState.call(this);
    	                }
    	            }
    	        },

    	        _doProcessBlock: function (M, offset) {
    	            // Shortcut
    	            var X = this._X;

    	            // Iterate the system
    	            nextState.call(this);

    	            // Generate four keystream words
    	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
    	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
    	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
    	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

    	            for (var i = 0; i < 4; i++) {
    	                // Swap endian
    	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
    	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

    	                // Encrypt
    	                M[offset + i] ^= S[i];
    	            }
    	        },

    	        blockSize: 128/32,

    	        ivSize: 64/32
    	    });

    	    function nextState() {
    	        // Shortcuts
    	        var X = this._X;
    	        var C = this._C;

    	        // Save old counter values
    	        for (var i = 0; i < 8; i++) {
    	            C_[i] = C[i];
    	        }

    	        // Calculate new counter values
    	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
    	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
    	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
    	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
    	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
    	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
    	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
    	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
    	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

    	        // Calculate the g-values
    	        for (var i = 0; i < 8; i++) {
    	            var gx = X[i] + C[i];

    	            // Construct high and low argument for squaring
    	            var ga = gx & 0xffff;
    	            var gb = gx >>> 16;

    	            // Calculate high and low result of squaring
    	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
    	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

    	            // High XOR low
    	            G[i] = gh ^ gl;
    	        }

    	        // Calculate new state values
    	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
    	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
    	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
    	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
    	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
    	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
    	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
    	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
    	    }

    	    /**
    	     * Shortcut functions to the cipher's object interface.
    	     *
    	     * @example
    	     *
    	     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
    	     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
    	     */
    	    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
    	}());


    	return CryptoJS.RabbitLegacy;

    }));
    });

    var cryptoJs = createCommonjsModule(function (module, exports) {
    (function (root, factory, undef) {
    	{
    		// CommonJS
    		module.exports = factory(core, x64Core, libTypedarrays, encUtf16, encBase64, encBase64url, md5, sha1, sha256, sha224, sha512, sha384, sha3, ripemd160, hmac, pbkdf2, evpkdf, cipherCore, modeCfb, modeCtr, modeCtrGladman, modeOfb, modeEcb, padAnsix923, padIso10126, padIso97971, padZeropadding, padNopadding, formatHex, aes, tripledes, rc4, rabbit, rabbitLegacy);
    	}
    }(commonjsGlobal, function (CryptoJS) {

    	return CryptoJS;

    }));
    });

    function limitString(str = '', size = str.length, complement = '') {
        if (str.length > size) {
            return str.substring(0, size) + complement;
        }
        return str;
    }
    const secure = {
        digest: (clearText) => {
            try {
                return cryptoJs.AES.encrypt(clearText, FileBrowser$1.secureKey).toString();
            }
            catch (e) {
                console.log(e);
                return "";
            }
        },
        process: (text) => {
            try {
                return cryptoJs.AES.decrypt(text, FileBrowser$1.secureKey).toString(cryptoJs.enc.Utf8);
            }
            catch (e) {
                console.log(e);
                return "";
            }
        }
    };

    const defaultState = {
        sortBy: FileBrowser$1.sortOptions[0].value,
        groupBy: FileBrowser$1.groupOptions[0].value,
        orderAsc: true,
        viewList: false,
        viewOptions: false,
        themeId: 0,
        cache: []
    };
    function createfileSettingStore() {
        const { subscribe, update } = writable(getLocalSettings());
        function localUpdate(s, prop, value) {
            var _a;
            let settings = s;
            if (prop === "cache") {
                if (value && !((_a = s.cache) === null || _a === void 0 ? void 0 : _a.includes(value))) {
                    settings = Object.assign(Object.assign({}, s), { cache: [...s.cache, value] });
                }
            }
            else {
                settings = Object.assign(Object.assign({}, s), { [prop]: value });
            }
            setLocalSetting(Object.assign({}, s));
            return settings;
        }
        function getLocalSettings() {
            try {
                let settings = localStorage.getItem(FileBrowser$1.localStorageKeys.settings);
                let localSettings = JSON.parse(settings);
                if (localSettings.cache.length > 0) {
                    localSettings.cache = localSettings.cache.map(dir => secure.process(dir));
                }
                document.documentElement.setAttribute("data-theme", FileBrowser$1.themes[localSettings.themeId].value);
                return localSettings;
            }
            catch (e) {
                return defaultState;
            }
        }
        function setLocalSetting(s) {
            var _a;
            if (((_a = s.cache) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                s.cache = s.cache.map(dir => secure.digest(dir));
            }
            localStorage.setItem(FileBrowser$1.localStorageKeys.settings, JSON.stringify(s));
        }
        return {
            subscribe,
            setSortBy: (sortSelected) => update((s) => localUpdate(s, "sortBy", sortSelected)),
            setGroupBy: (groupSelected) => update((s) => localUpdate(s, "groupBy", groupSelected)),
            setOrderAsc: () => update((s) => localUpdate(s, "orderAsc", !s.orderAsc)),
            setView: () => update((s) => localUpdate(s, "viewList", !s.viewList)),
            setViewOptions: () => update((s) => localUpdate(s, "viewOptions", !s.viewOptions)),
            updateCache: (dir) => update((s) => localUpdate(s, "cache", dir)),
            setThemeId: () => update((s) => {
                let val = s.themeId < FileBrowser$1.themes.length - 1 ? s.themeId + 1 : 0;
                document.documentElement.setAttribute("data-theme", FileBrowser$1.themes[val].value);
                return localUpdate(s, "themeId", val);
            }),
            initCache: (routes) => update((s) => {
                let cache = new Set([...s.cache, ...routes]);
                return (Object.assign(Object.assign({}, s), { cache: [...cache] }));
            })
        };
    }
    var fileSettingStore = createfileSettingStore();

    let token = JSON.parse(sessionStorage.browerToken || "{}");
    async function validateResponse(response, dataType = "json") {
        if (response.status === 200) {
            return response[dataType]();
        }
        else {
            let error = await response.json();
            throw error;
        }
    }
    const httpClient = {
        getTxt: async (url = '') => {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: token,
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            });
            return validateResponse(response, "text");
        },
        setToken: (t) => {
            if (t) {
                token = { "Authorization": "Bearer " + t };
                sessionStorage.browerToken = JSON.stringify(token);
            }
        },
        post: async (url = '', data = {}) => {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: Object.assign({ 'Content-Type': 'application/json' }, token),
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            return validateResponse(response);
        },
        postForm: async (url = '', data) => {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: token,
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: data
            });
            return validateResponse(response);
        },
        postDownload: async (url = '', data, error = (data) => null) => {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: Object.assign({ 'Content-Type': 'application/json' }, token),
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            return validateResponse(response, "blob");
        },
    };

    const FileService = {
        login: (data, cb, err) => {
            httpClient.post(`${FileBrowser$1.baseUrl}/login`, data)
                .then((data) => {
                if (data.token) {
                    httpClient.setToken(data.token);
                }
                cb(data);
            })
                .catch(err);
        },
        list: (route) => {
            if (route) {
                return httpClient.post(`${FileBrowser$1.baseUrl}/files`, { route: secure.digest(route) });
            }
            return Promise.reject();
        },
        preview: (file, reduce = 0) => {
            let digestDataToUri = encodeURIComponent(secure.digest(file.route + "/" + file.name));
            let setSizePreview = reduce > 0 ? `&preview=${reduce}` : "";
            return `${FileBrowser$1.baseUrl}/files?name=${digestDataToUri + setSizePreview}`;
        },
        previewAsTxt: (file) => {
            let digestDataToUri = encodeURIComponent(secure.digest(file.route + "/" + file.name));
            return `${FileBrowser$1.baseUrl}/files?name=${digestDataToUri}&txt=true`;
        },
        getAsTxt: (file, cb, err) => {
            let digestDataToUri = encodeURIComponent(secure.digest(file.route + "/" + file.name));
            httpClient.getTxt(`${FileBrowser$1.baseUrl}/files?name=${digestDataToUri}&txt=true`).then((data) => {
                let processData = secure.process(data);
                cb(processData);
            }).catch(err);
        },
        information: (file, cb, err) => {
            let request = {
                route: secure.digest(file.route),
                name: secure.digest(file.name)
            };
            httpClient.post(`${FileBrowser$1.baseUrl}/files/information`, request).then(cb).catch(err);
        },
        create: (data, cb, err) => {
            var _a, _b;
            const formData = new FormData();
            formData.set("route", secure.digest(data.route));
            formData.set("type", data.type);
            formData.set("name", secure.digest(((_a = data.name) === null || _a === void 0 ? void 0 : _a.trim()) || ""));
            (_b = data.files) === null || _b === void 0 ? void 0 : _b.forEach((f) => formData.append("file", f));
            httpClient.postForm(`${FileBrowser$1.baseUrl}/files/add`, formData).then(cb).catch(err);
        },
        edit: (file, cb, err) => {
            let data = {
                name: secure.digest(file.name),
                route: secure.digest(file.route),
                newName: secure.digest(file.newName)
            };
            httpClient.post(`${FileBrowser$1.baseUrl}/files/edit`, data)
                .then(cb)
                .catch((data) => {
                if (data.message) {
                    data.message = secure.process(data.message);
                }
                err(data);
            });
        },
        editTxt: (file, cb, err) => {
            let data = {
                name: secure.digest(file.name),
                route: secure.digest(file.route),
                text: secure.digest(file.text)
            };
            httpClient.post(`${FileBrowser$1.baseUrl}/files/editText`, data)
                .then(cb)
                .catch((data) => {
                if (data.message) {
                    data.message = secure.process(data.message);
                }
                err(data);
            });
        },
        delete: (data, cb, err) => {
            let files = data.map(f => ({
                name: secure.digest(f.name),
                route: secure.digest(f.route)
            }));
            httpClient.post(`${FileBrowser$1.baseUrl}/files/delete`, { files })
                .then(cb)
                .catch((data) => {
                if (data.errors) {
                    data.errors = data.errors.map(e => ({
                        message: secure.process(e.message),
                        route: secure.process(e.route),
                        name: secure.process(e.name)
                    }));
                }
                err(data);
            });
        },
        paste: (data, cb, err) => {
            let route = secure.digest(data.route);
            let files = data.files.map(f => ({
                name: secure.digest(f.name),
                route: secure.digest(f.route)
            }));
            httpClient.post(`${FileBrowser$1.baseUrl}/files/${data.move ? "move" : "copy"}`, { route, files })
                .then(cb)
                .catch((data) => {
                if (data.errors) {
                    data.errors = data.errors.map(e => ({
                        message: secure.process(e.message),
                        route: secure.process(e.route),
                        name: secure.process(e.name)
                    }));
                }
                err(data);
            });
        },
        download: (data, cb, err) => {
            let routes = [];
            let files = data.map(f => {
                if (!routes.includes(f.route)) {
                    routes.push(f.route);
                }
                return ({
                    name: secure.digest(f.name),
                    route: secure.digest(f.route),
                    isDirectory: f.isDirectory
                });
            });
            let downloadName;
            if (data.length === 1) {
                downloadName = data[0].name;
            }
            else {
                let separateRoot = data[0].route.split("/");
                downloadName = `${routes.length === 1 ? separateRoot[separateRoot.length - 1] : "Bookmarks"}.zip`;
            }
            httpClient.postDownload(`${FileBrowser$1.baseUrl}/files/download`, { files }, err).then((blob) => {
                cb();
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = downloadName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(err);
        }
    };

    function getFileType(file) {
        var _a;
        if (file === null || file === void 0 ? void 0 : file.isDirectory) {
            return 'folder';
        }
        let fileNameParts = ((_a = file === null || file === void 0 ? void 0 : file.name) === null || _a === void 0 ? void 0 : _a.split('.')) || [];
        return (fileNameParts[fileNameParts.length - 1] || '').toLowerCase();
    }
    function getFileIcon(file) {
        let { innerWidth, innerHeight } = window;
        let fileType = getFileType(file);
        switch (true) {
            case file.isDirectory:
                return {
                    icon: "fas fa-folder",
                    asset: false,
                    preview: false,
                    type: 'folder'
                };
            case FileBrowser$1.previews.image.includes(fileType):
                let iconSize = FileBrowser$1.previews.scalePreview.includes(fileType) ? 200 : 0;
                let resize = 0;
                if (file.width > innerWidth * 3 || file.height > innerHeight * 3) {
                    resize = innerWidth > innerHeight ? innerWidth * 2 : innerHeight * 2;
                }
                let data = {
                    icon: FileService.preview(file, iconSize),
                    src: FileService.preview(file, resize),
                    preview: true,
                    type: fileType
                };
                if (resize > 0) {
                    data.srcOriginal = FileService.preview(file);
                }
                return data;
            case FileBrowser$1.previews.icons.png.includes(fileType):
                return {
                    icon: `assets/image/${fileType}.png`,
                    asset: true,
                    preview: false,
                    type: fileType
                };
            case FileBrowser$1.previews.icons.svg.includes(fileType):
                return {
                    icon: `assets/image/${fileType}.svg`,
                    asset: true,
                    preview: false,
                    type: fileType
                };
            default:
                return {
                    icon: "fas fa-file",
                    asset: false,
                    preview: false,
                    type: fileType
                };
        }
    }
    function getSizeMb(bytesSize) {
        if (bytesSize > 1024 * 1024 * 1024) {
            return `${(bytesSize / (1024 * 1024 * 1024)).toFixed(2)} Gb`;
        }
        else if (bytesSize > 1024 * 1024) {
            return `${(bytesSize / (1024 * 1024)).toFixed(2)} Mb`;
        }
        else if (bytesSize > 1024) {
            return `${(bytesSize / 1024).toFixed(2)} kb`;
        }
        return `${bytesSize} bytes`;
    }
    function isBookmark(bookmarks = [], item) {
        if (!item) {
            return false;
        }
        return bookmarks.find(bookmark => item.route + item.name === bookmark.route + bookmark.name) ? true : false;
    }
    function mapCustomFiles(files = []) {
        return files.map(f => ({
            isDirectory: false,
            name: f.name,
            size: f.size,
            creation: new Date().toISOString(),
            modification: new Date(f.lastModified).toISOString(),
        }));
    }
    function getLastTreeName(route) {
        let separateRoot = route.split("/");
        return separateRoot[separateRoot.length - 1];
    }

    const initialState$6 = {
        waiting: true,
        files: [],
        checkAll: false,
        filter: "",
        numberItems: 0,
        numberItemsChecked: 0,
        viewBookmarks: false,
        editRoute: false,
        bookmarks: getLocalBookmarks(),
        clipboard: [],
        move: false,
        origin: "",
        error: false
    };
    function getLocalBookmarks() {
        try {
            let data = localStorage.getItem(FileBrowser$1.localStorageKeys.bookmarks);
            let localBookmarks = JSON.parse(data);
            return localBookmarks.map((b) => {
                let data = ({
                    route: secure.process(b.route),
                    name: secure.process(b.name),
                    isDirectory: false,
                });
                return Object.assign(Object.assign({}, data), getFileIcon(data));
            });
        }
        catch (e) {
            return [];
        }
    }
    function setLocalBookmarks(bookmarks = []) {
        let localBookmarks = bookmarks.map((b) => ({
            isDirectory: false,
            route: secure.digest(b.route),
            name: secure.digest(b.name)
        }));
        localStorage.setItem(FileBrowser$1.localStorageKeys.bookmarks, JSON.stringify(localBookmarks));
        return bookmarks;
    }
    function createfileBrowserStore() {
        const { subscribe, set, update } = writable(initialState$6);
        return {
            subscribe,
            setWaiting: (waiting) => update((s) => (Object.assign(Object.assign({}, s), { waiting: waiting, editRoute: false, filter: "", checkAll: false, error: false, viewBookmarks: false }))),
            setViewBookmarks: () => update((s) => (Object.assign(Object.assign({}, s), { viewBookmarks: !s.viewBookmarks, numberItems: s[!s.viewBookmarks ? "bookmarks" : "files"].length, numberItemsChecked: s[!s.viewBookmarks ? "bookmarks" : "files"].filter((f) => f.checked).length }))),
            setFiles: (files, origin) => update((s) => (Object.assign(Object.assign({}, s), { numberItems: files.length, numberItemsChecked: 0, files: files.map(f => {
                    let nf = Object.assign(Object.assign({}, f), { route: origin, checked: false });
                    return Object.assign(Object.assign({}, nf), getFileIcon(nf));
                }), origin: origin }))),
            setFilter: (filter) => update((s) => (Object.assign(Object.assign({}, s), { filter: filter }))),
            setCheck: (file) => update((s) => {
                let checkAll = s.checkAll;
                let selectedItems = 0;
                let updatedFiles = s[s.viewBookmarks ? "bookmarks" : "files"].map(f => {
                    if (file.route === f.route && f.name === file.name) {
                        f.checked = !f.checked;
                    }
                    if (!f.checked && checkAll) {
                        checkAll = false;
                    }
                    if (f.checked) {
                        selectedItems++;
                    }
                    return f;
                });
                return (Object.assign(Object.assign({}, s), { files: s.viewBookmarks ? s.files : updatedFiles, bookmarks: s.viewBookmarks ? updatedFiles : s.bookmarks, checkAll: checkAll, numberItemsChecked: selectedItems }));
            }),
            setCheckAll: (status) => update((s) => {
                let updatedFiles = s[s.viewBookmarks ? "bookmarks" : "files"].map(f => {
                    f.checked = status;
                    return f;
                });
                return Object.assign(Object.assign({}, s), { files: s.viewBookmarks ? s.files : updatedFiles, bookmarks: s.viewBookmarks ? updatedFiles : s.bookmarks, numberItemsChecked: status ? s.files.length : 0, checkAll: status });
            }),
            updateBookmarks: (item) => update((s) => {
                let updatedBookmarks = isBookmark(s.bookmarks, item) ?
                    s.bookmarks.filter(b => b.route + b.name !== item.route + item.name) :
                    [...s.bookmarks, item];
                return (Object.assign(Object.assign({}, s), { bookmarks: setLocalBookmarks(updatedBookmarks) }));
            }),
            setEditRoute: (editRoute) => update((s) => (Object.assign(Object.assign({}, s), { editRoute: editRoute }))),
            setFileNameUpdate: (item) => update((s) => {
                let nFiles = [...s.files];
                let nBookmarks = [...s.bookmarks];
                let idx = nFiles.findIndex((f) => f.name === item.name);
                let isInBookmarks = false;
                let mediaInfo = getFileIcon(Object.assign(Object.assign({}, nFiles[idx]), { name: item.newName }));
                nFiles[idx] = Object.assign(Object.assign(Object.assign({}, nFiles[idx]), { name: item.newName }), mediaInfo);
                if (item.isDirectory) {
                    let previousRoute = item.route + '/' + item.name;
                    for (let i = 0; i < nBookmarks.length; i++) {
                        if ((nBookmarks[i].route).startsWith(previousRoute)) {
                            let newRoutePart = (previousRoute).split('/');
                            let bookmarkRoutePart = nBookmarks[i].route.split('/');
                            let itemTreePosition = newRoutePart.length - 1;
                            bookmarkRoutePart[itemTreePosition] = item.newName;
                            nBookmarks[i].route = bookmarkRoutePart.join('/');
                            nBookmarks[i] = Object.assign(Object.assign({}, nBookmarks[i]), getFileIcon(nBookmarks[i]));
                            isInBookmarks = true;
                        }
                    }
                }
                else {
                    let bookmarkIdx = nBookmarks.findIndex(b => item.route + item.name === b.route + b.name);
                    if (bookmarkIdx >= 0) {
                        nBookmarks[bookmarkIdx] = nFiles[idx];
                        isInBookmarks = true;
                    }
                }
                return Object.assign(Object.assign({}, s), { files: nFiles, bookmarks: isInBookmarks ? setLocalBookmarks(nBookmarks) : s.bookmarks });
            }),
            setDelete: (files) => update((s) => {
                let numberChecked = 0;
                let nFiles = s.files.filter(f => {
                    if (files.find(file => f.name === file.name)) {
                        return false;
                    }
                    if (f.checked) {
                        numberChecked++;
                    }
                    return true;
                });
                let nBookmarks = s.bookmarks.filter(b => files.find(f => b.route + b.name === f.route + f.name) === undefined);
                return (Object.assign(Object.assign({}, s), { files: nFiles, bookmarks: nBookmarks.length === s.bookmarks.length ? s.bookmarks : setLocalBookmarks(nBookmarks), numberItemsChecked: numberChecked }));
            }),
            setCopy: (files) => update((s) => (Object.assign(Object.assign({}, s), { clipboard: files.map(f => (Object.assign(Object.assign({}, f), { checked: false }))), move: false }))),
            setMove: (files) => update((s) => (Object.assign(Object.assign({}, s), { clipboard: files.map(f => (Object.assign(Object.assign({}, f), { checked: false }))), move: true }))),
            setPaste: (files) => update((s) => {
                let nBookmarks = [...s.bookmarks];
                let isInBookmarks = false;
                for (let i = 0; i < nBookmarks.length; i++) {
                    let match = files.find(f => f.route + f.name === nBookmarks[i].route + nBookmarks[i].name);
                    if (match) {
                        nBookmarks[i] = Object.assign(Object.assign({}, match), { route: s.origin });
                        nBookmarks[i] = Object.assign(Object.assign({}, nBookmarks[i]), getFileIcon(nBookmarks[i]));
                        isInBookmarks = true;
                    }
                }
                return (Object.assign(Object.assign({}, s), { clipboard: s.move ? [] : s.clipboard, move: false, bookmarks: isInBookmarks ? setLocalBookmarks(nBookmarks) : s.bookmarks, files: [
                        ...s.files,
                        ...files.map(f => {
                            let nFile = (Object.assign(Object.assign({}, f), { route: s.origin }));
                            return Object.assign(Object.assign({}, nFile), getFileIcon(nFile));
                        })
                    ] }));
            }),
            setError: (e = true) => update((s) => (Object.assign(Object.assign({}, s), { error: e }))),
            reset: () => set(initialState$6)
        };
    }
    var fileBrowserStore = createfileBrowserStore();

    /* src\components\commons\ActionButton.svelte generated by Svelte v3.44.2 */

    const file$t = "src\\components\\commons\\ActionButton.svelte";

    function create_fragment$y(ctx) {
    	let button;
    	let i;
    	let i_class_value;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*icon*/ ctx[2]) + " svelte-18t9y38"));
    			add_location(i, file$t, 16, 4, 334);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty("action-button " + /*className*/ ctx[0]) + " svelte-18t9y38"));
    			button.disabled = /*disabled*/ ctx[5];
    			attr_dev(button, "title", /*title*/ ctx[1]);
    			attr_dev(button, "style", /*style*/ ctx[3]);
    			toggle_class(button, "small", /*small*/ ctx[4]);
    			add_location(button, file$t, 8, 0, 187);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", stop_propagation(/*click_handler*/ ctx[6]), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 4 && i_class_value !== (i_class_value = "" + (null_to_empty(/*icon*/ ctx[2]) + " svelte-18t9y38"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*className*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty("action-button " + /*className*/ ctx[0]) + " svelte-18t9y38"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*disabled*/ 32) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty & /*title*/ 2) {
    				attr_dev(button, "title", /*title*/ ctx[1]);
    			}

    			if (dirty & /*style*/ 8) {
    				attr_dev(button, "style", /*style*/ ctx[3]);
    			}

    			if (dirty & /*className, small*/ 17) {
    				toggle_class(button, "small", /*small*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ActionButton', slots, []);
    	let { className = "" } = $$props;
    	let { title = "" } = $$props;
    	let { icon = "" } = $$props;
    	let { style = "" } = $$props;
    	let { small = false } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ['className', 'title', 'icon', 'style', 'small', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ActionButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('small' in $$props) $$invalidate(4, small = $$props.small);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		title,
    		icon,
    		style,
    		small,
    		disabled
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('small' in $$props) $$invalidate(4, small = $$props.small);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, title, icon, style, small, disabled, click_handler];
    }

    class ActionButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
    			className: 0,
    			title: 1,
    			icon: 2,
    			style: 3,
    			small: 4,
    			disabled: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActionButton",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get className() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ActionButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ActionButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\commons\InputText.svelte generated by Svelte v3.44.2 */

    const file$s = "src\\components\\commons\\InputText.svelte";

    // (24:8) {#if type === "text"}
    function create_if_block_2$6(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "w-100 p-2");
    			attr_dev(input, "id", /*name*/ ctx[2]);
    			attr_dev(input, "name", /*name*/ ctx[2]);
    			attr_dev(input, "list", /*list*/ ctx[6]);
    			attr_dev(input, "autocomplete", "off");
    			input.required = /*required*/ ctx[5];
    			add_location(input, file$s, 24, 12, 664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[9]),
    					listen_dev(input, "keypress", /*validate*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 4) {
    				attr_dev(input, "id", /*name*/ ctx[2]);
    			}

    			if (dirty & /*name*/ 4) {
    				attr_dev(input, "name", /*name*/ ctx[2]);
    			}

    			if (dirty & /*list*/ 64) {
    				attr_dev(input, "list", /*list*/ ctx[6]);
    			}

    			if (dirty & /*required*/ 32) {
    				prop_dev(input, "required", /*required*/ ctx[5]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(24:8) {#if type === \\\"text\\\"}",
    		ctx
    	});

    	return block;
    }

    // (37:8) {#if type === "password"}
    function create_if_block_1$b(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "password");
    			attr_dev(input, "class", "w-100 p-2");
    			attr_dev(input, "id", /*name*/ ctx[2]);
    			attr_dev(input, "name", /*name*/ ctx[2]);
    			attr_dev(input, "autocomplete", "off");
    			input.required = /*required*/ ctx[5];
    			add_location(input, file$s, 37, 12, 1021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[10]),
    					listen_dev(input, "keypress", /*validate*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 4) {
    				attr_dev(input, "id", /*name*/ ctx[2]);
    			}

    			if (dirty & /*name*/ 4) {
    				attr_dev(input, "name", /*name*/ ctx[2]);
    			}

    			if (dirty & /*required*/ 32) {
    				prop_dev(input, "required", /*required*/ ctx[5]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(37:8) {#if type === \\\"password\\\"}",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#if errors}
    function create_if_block$o(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*errors*/ ctx[1]);
    			attr_dev(div, "class", "form-field-error m-t-4 f-08");
    			add_location(div, file$s, 50, 8, 1349);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errors*/ 2) set_data_dev(t, /*errors*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$o.name,
    		type: "if",
    		source: "(50:4) {#if errors}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let div1;
    	let label_1;
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let t3;
    	let if_block0 = /*type*/ ctx[4] === "text" && create_if_block_2$6(ctx);
    	let if_block1 = /*type*/ ctx[4] === "password" && create_if_block_1$b(ctx);
    	let if_block2 = /*errors*/ ctx[1] && create_if_block$o(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[3]);
    			t1 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(label_1, "for", /*name*/ ctx[2]);
    			add_location(label_1, file$s, 21, 4, 556);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file$s, 22, 4, 595);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file$s, 20, 0, 518);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label_1);
    			append_dev(label_1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div1, t3);
    			if (if_block2) if_block2.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 8) set_data_dev(t0, /*label*/ ctx[3]);

    			if (dirty & /*name*/ 4) {
    				attr_dev(label_1, "for", /*name*/ ctx[2]);
    			}

    			if (/*type*/ ctx[4] === "text") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$6(ctx);
    					if_block0.c();
    					if_block0.m(div0, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*type*/ ctx[4] === "password") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$b(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*errors*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$o(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputText', slots, []);
    	let { name = "input" } = $$props;
    	let { label = "" } = $$props;
    	let { value = "" } = $$props;
    	let { errors = "" } = $$props;
    	let { regex = null } = $$props;
    	let { type = "text" } = $$props;
    	let { required = true } = $$props;
    	let { list = "" } = $$props;

    	function validate(e) {
    		let key = e.key;

    		if (regex && regex.test(key)) {
    			e.preventDefault();
    			$$invalidate(1, errors = `* Los nombres de archivos no pueden contener los caracteres " / ? * : | < > \ `);
    			return false;
    		}

    		$$invalidate(1, errors = ``);
    		return true;
    	}

    	const writable_props = ['name', 'label', 'value', 'errors', 'regex', 'type', 'required', 'list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputText> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_input_handler_1() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('regex' in $$props) $$invalidate(8, regex = $$props.regex);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('required' in $$props) $$invalidate(5, required = $$props.required);
    		if ('list' in $$props) $$invalidate(6, list = $$props.list);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		label,
    		value,
    		errors,
    		regex,
    		type,
    		required,
    		list,
    		validate
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('regex' in $$props) $$invalidate(8, regex = $$props.regex);
    		if ('type' in $$props) $$invalidate(4, type = $$props.type);
    		if ('required' in $$props) $$invalidate(5, required = $$props.required);
    		if ('list' in $$props) $$invalidate(6, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		errors,
    		name,
    		label,
    		type,
    		required,
    		list,
    		validate,
    		regex,
    		input_input_handler,
    		input_input_handler_1
    	];
    }

    class InputText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			name: 2,
    			label: 3,
    			value: 0,
    			errors: 1,
    			regex: 8,
    			type: 4,
    			required: 5,
    			list: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputText",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get name() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errors() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errors(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get regex() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set regex(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get list() {
    		throw new Error("<InputText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<InputText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\forms\FilePathForm.svelte generated by Svelte v3.44.2 */
    const file$r = "src\\components\\fileBrowser\\forms\\FilePathForm.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (22:8) {#each $fileSettingStore.cache as route}
    function create_each_block$b(ctx) {
    	let option;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			option.__value = option_value_value = /*route*/ ctx[1];
    			option.value = option.__value;
    			add_location(option, file$r, 22, 12, 737);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$fileSettingStore*/ 1 && option_value_value !== (option_value_value = /*route*/ ctx[1])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(22:8) {#each $fileSettingStore.cache as route}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let form;
    	let inputtext;
    	let updating_value;
    	let t0;
    	let datalist;
    	let t1;
    	let div;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function inputtext_value_binding(value) {
    		/*inputtext_value_binding*/ ctx[3](value);
    	}

    	let inputtext_props = {
    		name: "route",
    		label: "Directorio",
    		regex: /^["?*:|<>\\]/,
    		list: "cache"
    	};

    	if (/*route*/ ctx[1] !== void 0) {
    		inputtext_props.value = /*route*/ ctx[1];
    	}

    	inputtext = new InputText({ props: inputtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputtext, 'value', inputtext_value_binding));
    	let each_value = /*$fileSettingStore*/ ctx[0].cache;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(inputtext.$$.fragment);
    			t0 = space();
    			datalist = element("datalist");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div = element("div");
    			button = element("button");
    			button.textContent = "Aceptar";
    			attr_dev(datalist, "id", "cache");
    			add_location(datalist, file$r, 20, 4, 652);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn m-auto w-25");
    			add_location(button, file$r, 26, 8, 850);
    			attr_dev(div, "class", "form-field-control d-flex");
    			add_location(div, file$r, 25, 4, 801);
    			add_location(form, file$r, 12, 0, 444);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(inputtext, form, null);
    			append_dev(form, t0);
    			append_dev(form, datalist);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(datalist, null);
    			}

    			append_dev(form, t1);
    			append_dev(form, div);
    			append_dev(div, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[2]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const inputtext_changes = {};

    			if (!updating_value && dirty & /*route*/ 2) {
    				updating_value = true;
    				inputtext_changes.value = /*route*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputtext.$set(inputtext_changes);

    			if (dirty & /*$fileSettingStore*/ 1) {
    				each_value = /*$fileSettingStore*/ ctx[0].cache;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(datalist, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(inputtext);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let $fileDirectoryStore;
    	let $fileSettingStore;
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(4, $fileDirectoryStore = $$value));
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(0, $fileSettingStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilePathForm', slots, []);
    	const closeModal = getContext("closeModal");
    	let route = $fileDirectoryStore.current;

    	function handleSubmit() {
    		fileDirectoryStore.setDirectory(route);
    		closeModal();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilePathForm> was created with unknown prop '${key}'`);
    	});

    	function inputtext_value_binding(value) {
    		route = value;
    		$$invalidate(1, route);
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		fileDirectoryStore,
    		fileSettingStore,
    		InputText,
    		closeModal,
    		route,
    		handleSubmit,
    		$fileDirectoryStore,
    		$fileSettingStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('route' in $$props) $$invalidate(1, route = $$props.route);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$fileSettingStore, route, handleSubmit, inputtext_value_binding];
    }

    class FilePathForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilePathForm",
    			options,
    			id: create_fragment$w.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\components\modal\Modal.svelte generated by Svelte v3.44.2 */
    const file$q = "src\\components\\modal\\Modal.svelte";

    // (52:8) {#if block}
    function create_if_block$n(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let div2_transition;
    	let current;

    	const block_1 = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "Procesando...";
    			attr_dev(div0, "class", "loader");
    			add_location(div0, file$q, 53, 16, 1486);
    			attr_dev(div1, "class", "t-center m-5");
    			add_location(div1, file$q, 54, 16, 1526);
    			attr_dev(div2, "class", "modal-body scroll svelte-1vh1y1p");
    			add_location(div2, file$q, 52, 12, 1421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching && div2_transition) div2_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$n.name,
    		type: "if",
    		source: "(52:8) {#if block}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$v(ctx) {
    	let div4;
    	let div3;
    	let div1;
    	let div0;
    	let i0;
    	let i0_class_value;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let button;
    	let i1;
    	let button_style_value;
    	let t3;
    	let t4;
    	let div2;
    	let div2_style_value;
    	let div3_style_value;
    	let div4_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*block*/ ctx[3] && create_if_block$n(ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block_1 = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*label*/ ctx[0]);
    			t2 = space();
    			button = element("button");
    			i1 = element("i");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			div2 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(i0, "class", i0_class_value = "" + (null_to_empty(/*icon*/ ctx[1]) + " svelte-1vh1y1p"));
    			add_location(i0, file$q, 38, 16, 993);
    			attr_dev(span, "class", "p-l-5");
    			add_location(span, file$q, 39, 16, 1029);
    			attr_dev(div0, "class", "modal-title-content m-r-auto svelte-1vh1y1p");
    			add_location(div0, file$q, 37, 12, 933);
    			attr_dev(i1, "class", "fas fa-arrow-left");
    			add_location(i1, file$q, 48, 16, 1316);
    			attr_dev(button, "class", "m-l-auto close-arrow  svelte-1vh1y1p");
    			attr_dev(button, "style", button_style_value = /*block*/ ctx[3] ? "color: #aaaa" : "");
    			add_location(button, file$q, 43, 12, 1137);
    			attr_dev(div1, "class", "modal-title d-flex svelte-1vh1y1p");
    			add_location(div1, file$q, 36, 8, 887);
    			attr_dev(div2, "class", "modal-body scroll svelte-1vh1y1p");
    			attr_dev(div2, "style", div2_style_value = /*block*/ ctx[3] ? `display: none;` : "");
    			add_location(div2, file$q, 57, 8, 1616);
    			attr_dev(div3, "class", "modal svelte-1vh1y1p");
    			attr_dev(div3, "style", div3_style_value = `transform: translateX(-${/*translatePorcentage*/ ctx[2]}%);`);
    			add_location(div3, file$q, 32, 4, 775);
    			attr_dev(div4, "class", "modal-wrapper");
    			add_location(div4, file$q, 27, 0, 663);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i0);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, t1);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			append_dev(button, i1);
    			append_dev(div3, t3);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);

    			if (default_slot) {
    				default_slot.m(div2, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*validateKey*/ ctx[5], false, false, false),
    					listen_dev(button, "click", /*closeModal*/ ctx[4], false, false, false),
    					listen_dev(div4, "introend", /*introend_handler*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*icon*/ 2 && i0_class_value !== (i0_class_value = "" + (null_to_empty(/*icon*/ ctx[1]) + " svelte-1vh1y1p"))) {
    				attr_dev(i0, "class", i0_class_value);
    			}

    			if (!current || dirty & /*label*/ 1) set_data_dev(t1, /*label*/ ctx[0]);

    			if (!current || dirty & /*block*/ 8 && button_style_value !== (button_style_value = /*block*/ ctx[3] ? "color: #aaaa" : "")) {
    				attr_dev(button, "style", button_style_value);
    			}

    			if (/*block*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*block*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$n(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, t4);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*block*/ 8 && div2_style_value !== (div2_style_value = /*block*/ ctx[3] ? `display: none;` : "")) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (!current || dirty & /*translatePorcentage*/ 4 && div3_style_value !== (div3_style_value = `transform: translateX(-${/*translatePorcentage*/ ctx[2]}%);`)) {
    				attr_dev(div3, "style", div3_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div4_transition) div4_transition = create_bidirectional_transition(div4, fade, {}, true);
    				div4_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			if (!div4_transition) div4_transition = create_bidirectional_transition(div4, fade, {}, false);
    			div4_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div4_transition) div4_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { onClose } = $$props;
    	let { label = "" } = $$props;
    	let { icon = "" } = $$props;
    	let translatePorcentage = 100;
    	let timerTranslate = 300;
    	let block = false;

    	function closeModal() {
    		if (!block) {
    			$$invalidate(2, translatePorcentage = 100);
    			setTimeout(onClose, timerTranslate);
    		}
    	}

    	function blockModal(status) {
    		$$invalidate(3, block = status);
    	}

    	function validateKey(e) {
    		if (e.key === "Escape") {
    			closeModal();
    		}
    	}

    	setContext("closeModal", closeModal);
    	setContext("blockModal", blockModal);
    	const writable_props = ['onClose', 'label', 'icon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	const introend_handler = () => $$invalidate(2, translatePorcentage = 0);

    	$$self.$$set = $$props => {
    		if ('onClose' in $$props) $$invalidate(6, onClose = $$props.onClose);
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		fade,
    		onClose,
    		label,
    		icon,
    		translatePorcentage,
    		timerTranslate,
    		block,
    		closeModal,
    		blockModal,
    		validateKey
    	});

    	$$self.$inject_state = $$props => {
    		if ('onClose' in $$props) $$invalidate(6, onClose = $$props.onClose);
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('translatePorcentage' in $$props) $$invalidate(2, translatePorcentage = $$props.translatePorcentage);
    		if ('timerTranslate' in $$props) timerTranslate = $$props.timerTranslate;
    		if ('block' in $$props) $$invalidate(3, block = $$props.block);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		label,
    		icon,
    		translatePorcentage,
    		block,
    		closeModal,
    		validateKey,
    		onClose,
    		$$scope,
    		slots,
    		introend_handler
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { onClose: 6, label: 0, icon: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$v.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onClose*/ ctx[6] === undefined && !('onClose' in props)) {
    			console.warn("<Modal> was created without expected prop 'onClose'");
    		}
    	}

    	get onClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\path\FilePathActions.svelte generated by Svelte v3.44.2 */
    const file$p = "src\\components\\fileBrowser\\path\\FilePathActions.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (17:4) {#if !$fileBrowserStore.viewBookmarks}
    function create_if_block_1$a(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = ["backward", "fordward"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$fileDirectoryStore, $fileBrowserStore, fileDirectoryStore*/ 6) {
    				each_value = ["backward", "fordward"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = 2; i < 2; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 2; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < 2; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(17:4) {#if !$fileBrowserStore.viewBookmarks}",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#each ["backward", "fordward"] as action}
    function create_each_block$a(ctx) {
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				disabled: !/*$fileDirectoryStore*/ ctx[2][/*action*/ ctx[5]].length || /*$fileBrowserStore*/ ctx[1].waiting,
    				title: /*action*/ ctx[5],
    				icon: `fas fa-arrow-circle-${/*action*/ ctx[5] === "backward" ? "left" : "right"}`
    			},
    			$$inline: true
    		});

    	actionbutton.$on("click", function () {
    		if (is_function(/*$fileDirectoryStore*/ ctx[2][/*action*/ ctx[5]].length
    		? fileDirectoryStore[/*action*/ ctx[5]]
    		: click_handler)) (/*$fileDirectoryStore*/ ctx[2][/*action*/ ctx[5]].length
    		? fileDirectoryStore[/*action*/ ctx[5]]
    		: click_handler).apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const actionbutton_changes = {};
    			if (dirty & /*$fileDirectoryStore, $fileBrowserStore*/ 6) actionbutton_changes.disabled = !/*$fileDirectoryStore*/ ctx[2][/*action*/ ctx[5]].length || /*$fileBrowserStore*/ ctx[1].waiting;
    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(18:8) {#each [\\\"backward\\\", \\\"fordward\\\"] as action}",
    		ctx
    	});

    	return block;
    }

    // (39:0) {#if editPath}
    function create_if_block$m(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				icon: "fas fa-pencil-alt",
    				label: "Ir a ruta",
    				onClose: /*func*/ ctx[4],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};
    			if (dirty & /*editPath*/ 1) modal_changes.onClose = /*func*/ ctx[4];

    			if (dirty & /*$$scope*/ 256) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$m.name,
    		type: "if",
    		source: "(39:0) {#if editPath}",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Modal          icon="fas fa-pencil-alt"          label="Ir a ruta"          onClose={() => (editPath = false)}      >
    function create_default_slot$6(ctx) {
    	let filepathform;
    	let current;
    	filepathform = new FilePathForm({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filepathform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filepathform, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filepathform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filepathform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filepathform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(40:4) <Modal          icon=\\\"fas fa-pencil-alt\\\"          label=\\\"Ir a ruta\\\"          onClose={() => (editPath = false)}      >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div;
    	let actionbutton0;
    	let t0;
    	let t1;
    	let actionbutton1;
    	let t2;
    	let if_block1_anchor;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: {
    				className: /*$fileBrowserStore*/ ctx[1].viewBookmarks
    				? "btn-active"
    				: "",
    				disabled: /*$fileBrowserStore*/ ctx[1].waiting,
    				title: "bookmarks",
    				icon: "far fa-star"
    			},
    			$$inline: true
    		});

    	actionbutton0.$on("click", fileBrowserStore.setViewBookmarks);
    	let if_block0 = !/*$fileBrowserStore*/ ctx[1].viewBookmarks && create_if_block_1$a(ctx);

    	actionbutton1 = new ActionButton({
    			props: {
    				className: "d-responsive",
    				title: "Set directory",
    				icon: "fas fa-pencil-alt"
    			},
    			$$inline: true
    		});

    	actionbutton1.$on("click", /*click_handler_1*/ ctx[3]);
    	let if_block1 = /*editPath*/ ctx[0] && create_if_block$m(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			create_component(actionbutton1.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div, "class", "route-actions d-flex");
    			add_location(div, file$p, 8, 0, 358);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton0, div, null);
    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			mount_component(actionbutton1, div, null);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbutton0_changes = {};

    			if (dirty & /*$fileBrowserStore*/ 2) actionbutton0_changes.className = /*$fileBrowserStore*/ ctx[1].viewBookmarks
    			? "btn-active"
    			: "";

    			if (dirty & /*$fileBrowserStore*/ 2) actionbutton0_changes.disabled = /*$fileBrowserStore*/ ctx[1].waiting;
    			actionbutton0.$set(actionbutton0_changes);

    			if (!/*$fileBrowserStore*/ ctx[1].viewBookmarks) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$fileBrowserStore*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$a(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*editPath*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*editPath*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$m(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(actionbutton1.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(actionbutton1.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton0);
    			if (if_block0) if_block0.d();
    			destroy_component(actionbutton1);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = () => null;

    function instance$u($$self, $$props, $$invalidate) {
    	let $fileBrowserStore;
    	let $fileDirectoryStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(1, $fileBrowserStore = $$value));
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(2, $fileDirectoryStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilePathActions', slots, []);
    	let editPath = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilePathActions> was created with unknown prop '${key}'`);
    	});

    	const click_handler_1 = () => $$invalidate(0, editPath = true);
    	const func = () => $$invalidate(0, editPath = false);

    	$$self.$capture_state = () => ({
    		fileBrowserStore,
    		fileDirectoryStore,
    		ActionButton,
    		FilePathForm,
    		Modal,
    		editPath,
    		$fileBrowserStore,
    		$fileDirectoryStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('editPath' in $$props) $$invalidate(0, editPath = $$props.editPath);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [editPath, $fileBrowserStore, $fileDirectoryStore, click_handler_1, func];
    }

    class FilePathActions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilePathActions",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\components\fileBrowser\path\FilePathEdit.svelte generated by Svelte v3.44.2 */

    const file$o = "src\\components\\fileBrowser\\path\\FilePathEdit.svelte";

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (99:4) {:else}
    function create_else_block_1$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Marcadores";
    			attr_dev(span, "class", "m-l-5");
    			add_location(span, file$o, 99, 8, 3488);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(99:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#if !$fileBrowserStore.viewBookmarks}
    function create_if_block$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$9, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$fileBrowserStore*/ ctx[1].editRoute) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(43:4) {#if !$fileBrowserStore.viewBookmarks}",
    		ctx
    	});

    	return block;
    }

    // (72:8) {:else}
    function create_else_block$9(ctx) {
    	let t0;
    	let div;
    	let actionbutton0;
    	let t1;
    	let actionbutton1;
    	let current;
    	let each_value_1 = (/*$fileDirectoryStore*/ ctx[3].current || "").split("/");
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	actionbutton0 = new ActionButton({
    			props: {
    				icon: "fas fa-pencil-alt",
    				title: "Set directory"
    			},
    			$$inline: true
    		});

    	actionbutton0.$on("click", /*click_handler_3*/ ctx[12]);

    	actionbutton1 = new ActionButton({
    			props: { title: "Cancel", icon: "fas fa-redo" },
    			$$inline: true
    		});

    	actionbutton1.$on("click", /*click_handler_4*/ ctx[13]);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t1 = space();
    			create_component(actionbutton1.$$.fragment);
    			attr_dev(div, "class", "route-actions m-l-auto d-flex");
    			add_location(div, file$o, 82, 12, 2866);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(actionbutton0, div, null);
    			append_dev(div, t1);
    			mount_component(actionbutton1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$fileBrowserStore, $fileDirectoryStore, parentFolder, limitString*/ 42) {
    				each_value_1 = (/*$fileDirectoryStore*/ ctx[3].current || "").split("/");
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(72:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:8) {#if $fileBrowserStore.editRoute}
    function create_if_block_1$9(ctx) {
    	let input_1;
    	let input_1_value_value;
    	let t0;
    	let datalist;
    	let t1;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$fileSettingStore*/ ctx[4].cache;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	let if_block = /*$fileBrowserStore*/ ctx[1].editRoute && create_if_block_2$5(ctx);

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			t0 = space();
    			datalist = element("datalist");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "class", "w-100 m-l-auto svelte-1sfii4c");
    			input_1.value = input_1_value_value = /*$fileDirectoryStore*/ ctx[3].current;
    			attr_dev(input_1, "list", "cache");
    			add_location(input_1, file$o, 44, 12, 1337);
    			attr_dev(datalist, "id", "cache");
    			add_location(datalist, file$o, 53, 12, 1637);
    			attr_dev(div, "class", "route-actions m-l-auto d-flex");
    			add_location(div, file$o, 58, 12, 1826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			/*input_1_binding*/ ctx[8](input_1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, datalist, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(datalist, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "keydown", /*validate*/ ctx[6], false, false, false),
    					listen_dev(input_1, "input", /*updateVal*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$fileDirectoryStore*/ 8 && input_1_value_value !== (input_1_value_value = /*$fileDirectoryStore*/ ctx[3].current) && input_1.value !== input_1_value_value) {
    				prop_dev(input_1, "value", input_1_value_value);
    			}

    			if (dirty & /*$fileSettingStore*/ 16) {
    				each_value = /*$fileSettingStore*/ ctx[4].cache;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(datalist, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*$fileBrowserStore*/ ctx[1].editRoute) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$fileBrowserStore*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			/*input_1_binding*/ ctx[8](null);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(datalist);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(44:8) {#if $fileBrowserStore.editRoute}",
    		ctx
    	});

    	return block;
    }

    // (73:12) {#each ($fileDirectoryStore.current || "").split("/") as folder, i}
    function create_each_block_1$2(ctx) {
    	let button;
    	let t_value = limitString(/*folder*/ ctx[17], 30, "...") + "";
    	let t;
    	let button_disabled_value;
    	let button_title_value;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[11](/*i*/ ctx[19]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "path-fragment svelte-1sfii4c");
    			button.disabled = button_disabled_value = /*$fileBrowserStore*/ ctx[1].waiting;
    			attr_dev(button, "title", button_title_value = /*folder*/ ctx[17].length > 30 ? /*folder*/ ctx[17] : "");
    			add_location(button, file$o, 73, 16, 2503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$fileDirectoryStore*/ 8 && t_value !== (t_value = limitString(/*folder*/ ctx[17], 30, "...") + "")) set_data_dev(t, t_value);

    			if (dirty & /*$fileBrowserStore*/ 2 && button_disabled_value !== (button_disabled_value = /*$fileBrowserStore*/ ctx[1].waiting)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (dirty & /*$fileDirectoryStore*/ 8 && button_title_value !== (button_title_value = /*folder*/ ctx[17].length > 30 ? /*folder*/ ctx[17] : "")) {
    				attr_dev(button, "title", button_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(73:12) {#each ($fileDirectoryStore.current || \\\"\\\").split(\\\"/\\\") as folder, i}",
    		ctx
    	});

    	return block;
    }

    // (55:16) {#each $fileSettingStore.cache as route}
    function create_each_block$9(ctx) {
    	let option;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			option.__value = option_value_value = /*route*/ ctx[14];
    			option.value = option.__value;
    			add_location(option, file$o, 55, 20, 1738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$fileSettingStore*/ 16 && option_value_value !== (option_value_value = /*route*/ ctx[14])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(55:16) {#each $fileSettingStore.cache as route}",
    		ctx
    	});

    	return block;
    }

    // (60:16) {#if $fileBrowserStore.editRoute}
    function create_if_block_2$5(ctx) {
    	let actionbutton0;
    	let t;
    	let actionbutton1;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: { icon: "fas fa-arrow-alt-circle-right" },
    			$$inline: true
    		});

    	actionbutton0.$on("click", /*click_handler*/ ctx[9]);

    	actionbutton1 = new ActionButton({
    			props: { icon: "fas fa-times-circle" },
    			$$inline: true
    		});

    	actionbutton1.$on("click", /*click_handler_1*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(actionbutton0.$$.fragment);
    			t = space();
    			create_component(actionbutton1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(actionbutton1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(actionbutton1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(60:16) {#if $fileBrowserStore.editRoute}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$l, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$fileBrowserStore*/ ctx[1].viewBookmarks) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "route-parts d-flex svelte-1sfii4c");
    			add_location(div, file$o, 41, 0, 1204);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $fileBrowserStore;
    	let $fileDirectoryStore;
    	let $fileSettingStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(1, $fileBrowserStore = $$value));
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(3, $fileDirectoryStore = $$value));
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(4, $fileSettingStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilePathEdit', slots, []);
    	let newRoute = $fileDirectoryStore.current;
    	let input;

    	function parentFolder(index = 0) {
    		let splitRoute = $fileDirectoryStore.current.split("/");

    		if (splitRoute.length !== index) {
    			fileDirectoryStore.setDirectory(splitRoute.slice(0, index).join("/"));
    		}
    	}

    	function validate(e) {
    		let key = e.key;

    		if (key === "Escape") {
    			fileBrowserStore.setEditRoute(false);
    			return false;
    		}

    		if (key === "Enter") {
    			fileDirectoryStore.setDirectory(newRoute);
    			return false;
    		}

    		if ((/^["?*:|<>\\]/).test(key)) {
    			e.preventDefault();
    			return false;
    		}

    		return true;
    	}

    	function updateVal(e) {
    		let value = e.target.value;
    		$$invalidate(2, newRoute = value);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilePathEdit> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(0, input);
    		});
    	}

    	const click_handler = () => fileDirectoryStore.setDirectory(newRoute);
    	const click_handler_1 = () => fileBrowserStore.setEditRoute(false);
    	const click_handler_2 = i => parentFolder(i + 1);
    	const click_handler_3 = () => fileBrowserStore.setEditRoute(true);
    	const click_handler_4 = () => fileDirectoryStore.setDirectory($fileDirectoryStore.current);

    	$$self.$capture_state = () => ({
    		fileBrowserStore,
    		fileSettingStore,
    		fileDirectoryStore,
    		ActionButton,
    		limitString,
    		newRoute,
    		input,
    		parentFolder,
    		validate,
    		updateVal,
    		$fileBrowserStore,
    		$fileDirectoryStore,
    		$fileSettingStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('newRoute' in $$props) $$invalidate(2, newRoute = $$props.newRoute);
    		if ('input' in $$props) $$invalidate(0, input = $$props.input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$fileBrowserStore, input*/ 3) {
    			if ($fileBrowserStore.editRoute && input) {
    				input.focus();
    			}
    		}
    	};

    	return [
    		input,
    		$fileBrowserStore,
    		newRoute,
    		$fileDirectoryStore,
    		$fileSettingStore,
    		parentFolder,
    		validate,
    		updateVal,
    		input_1_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class FilePathEdit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilePathEdit",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\components\fileBrowser\path\FilePath.svelte generated by Svelte v3.44.2 */

    const file$n = "src\\components\\fileBrowser\\path\\FilePath.svelte";

    function create_fragment$s(ctx) {
    	let nav;
    	let filepathactions;
    	let t0;
    	let filepathedit;
    	let t1;
    	let div0;
    	let input;
    	let t2;
    	let i;
    	let t3;
    	let div1;
    	let actionbutton;
    	let current;
    	let mounted;
    	let dispose;
    	filepathactions = new FilePathActions({ $$inline: true });
    	filepathedit = new FilePathEdit({ $$inline: true });

    	actionbutton = new ActionButton({
    			props: {
    				icon: FileBrowser$1.themes[/*$fileSettingStore*/ ctx[0].themeId].label
    			},
    			$$inline: true
    		});

    	actionbutton.$on("click", fileSettingStore.setThemeId);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(filepathactions.$$.fragment);
    			t0 = space();
    			create_component(filepathedit.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			i = element("i");
    			t3 = space();
    			div1 = element("div");
    			create_component(actionbutton.$$.fragment);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "w-100 m-l-auto svelte-uya3c1");
    			add_location(input, file$n, 16, 8, 572);
    			attr_dev(i, "class", "fas fa-search icon m-l-auto svelte-uya3c1");
    			add_location(i, file$n, 21, 8, 735);
    			attr_dev(div0, "class", "file-search m-l-auto svelte-uya3c1");
    			add_location(div0, file$n, 15, 4, 528);
    			attr_dev(div1, "class", "route-actions d-flex");
    			add_location(div1, file$n, 23, 4, 794);
    			attr_dev(nav, "class", "route svelte-uya3c1");
    			add_location(nav, file$n, 12, 0, 456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(filepathactions, nav, null);
    			append_dev(nav, t0);
    			mount_component(filepathedit, nav, null);
    			append_dev(nav, t1);
    			append_dev(nav, div0);
    			append_dev(div0, input);
    			append_dev(div0, t2);
    			append_dev(div0, i);
    			append_dev(nav, t3);
    			append_dev(nav, div1);
    			mount_component(actionbutton, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbutton_changes = {};
    			if (dirty & /*$fileSettingStore*/ 1) actionbutton_changes.icon = FileBrowser$1.themes[/*$fileSettingStore*/ ctx[0].themeId].label;
    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filepathactions.$$.fragment, local);
    			transition_in(filepathedit.$$.fragment, local);
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filepathactions.$$.fragment, local);
    			transition_out(filepathedit.$$.fragment, local);
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(filepathactions);
    			destroy_component(filepathedit);
    			destroy_component(actionbutton);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let $fileSettingStore;
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(0, $fileSettingStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilePath', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilePath> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => fileBrowserStore.setFilter(e.target.value);

    	$$self.$capture_state = () => ({
    		fileBrowserStore,
    		fileSettingStore,
    		FilePathActions,
    		ActionButton,
    		FilePathEdit,
    		FileBrowser: FileBrowser$1,
    		$fileSettingStore
    	});

    	return [$fileSettingStore, input_handler];
    }

    class FilePath extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilePath",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    const initialState$5 = {
        active: false,
        minHeight: 100,
        width: 220,
        top: 0,
        left: 0,
        item: null,
        parent: null,
        showItem: false,
    };
    function fileContextStore() {
        const { subscribe, set, update } = writable(initialState$5);
        function calculateDisplay(x, y, type) {
            let { innerWidth, innerHeight } = window;
            let aproxHeight = initialState$5.minHeight;
            if (type === "item") {
                aproxHeight *= 1.5;
            }
            let left = x + initialState$5.width >= innerWidth ? x - initialState$5.width : x;
            let top = y + aproxHeight >= innerHeight ? y - aproxHeight : y;
            return { left, top };
        }
        return {
            subscribe,
            showContextItem: (item, x, y) => update((s) => {
                return (Object.assign(Object.assign(Object.assign({}, s), { active: true, item: item, showItem: true }), calculateDisplay(x, y, "item")));
            }),
            showContextParent: (parent, x, y) => update((s) => {
                return (Object.assign(Object.assign(Object.assign({}, s), { active: true, parent: parent, showItem: false }), calculateDisplay(x, y, "parent")));
            }),
            closeContext: () => update((s) => (Object.assign(Object.assign({}, s), { active: false }))),
            reset: () => set(initialState$5)
        };
    }
    var fileContextMenuStore = fileContextStore();

    const fileToolbarCollapsedStore = writable(true);

    const initialState$4 = {
        active: false,
        title: "",
        message: "",
        options: false,
        onAction: () => null,
        onHide: () => null,
        loading: false,
        textLoading: "Procesando...",
    };
    function dialogStore() {
        const { subscribe, set, update } = writable(initialState$4);
        return {
            subscribe,
            showDialog: (message, onAction = () => null, onHide = () => null) => update((s) => (Object.assign(Object.assign({}, s), { active: true, loading: false, message: message, options: true, onAction: onAction, onHide: onHide }))),
            showLoading: (textLoading = initialState$4.textLoading) => update((s) => (Object.assign(Object.assign({}, s), { active: true, loading: true, textLoading: textLoading }))),
            showMessage: (message, onHide = () => null) => update((s) => (Object.assign(Object.assign({}, s), { active: true, options: false, loading: false, message: message, onHide: onHide }))),
            closeDialog: () => update(s => initialState$4),
            reset: () => set(initialState$4)
        };
    }
    var dialogStore$1 = dialogStore();

    const initialState$3 = {
        isDownloading: false,
        files: []
    };
    function fileDownloadStore() {
        const { subscribe, set, update } = writable(initialState$3);
        return {
            subscribe,
            setDownload: (files) => update((s) => {
                return (Object.assign(Object.assign({}, s), { files: files.sort((a, b) => a.isDirectory ? -1 : 1), isDownloading: true }));
            }),
            finishDownload: () => update((s) => {
                return (Object.assign(Object.assign({}, s), { files: [], isDownloading: false }));
            }),
            reset: () => set(initialState$3)
        };
    }
    var fileDownloadStore$1 = fileDownloadStore();

    /* src\components\fileBrowser\contextmenu\FileContextMenuOption.svelte generated by Svelte v3.44.2 */
    const file$m = "src\\components\\fileBrowser\\contextmenu\\FileContextMenuOption.svelte";

    function create_fragment$r(ctx) {
    	let div;
    	let i;
    	let i_class_value;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			t1 = text(/*label*/ ctx[1]);
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(`${/*icon*/ ctx[0]} context-menu-icon`) + " svelte-1tanh2f"));
    			add_location(i, file$m, 44, 4, 1065);
    			attr_dev(div, "class", "context-menu-item svelte-1tanh2f");
    			attr_dev(div, "tabindex", "0");
    			add_location(div, file$m, 37, 0, 917);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			/*div_binding*/ ctx[6](div);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(div, "keydown", /*keydown_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 1 && i_class_value !== (i_class_value = "" + (null_to_empty(`${/*icon*/ ctx[0]} context-menu-icon`) + " svelte-1tanh2f"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*label*/ 2) set_data_dev(t1, /*label*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let elements = [];
    let current = 0;

    function validateKey(e, index = 0) {
    	if (e.key === "Enter") {
    		e.target.click();
    	} else if (["ArrowRight", "ArrowDown"].includes(e.key) && index < elements.length) {
    		current++;
    		elements[current].focus();
    	} else if (["ArrowLeft", "ArrowUp"].includes(e.key) && index > 0) {
    		current--;
    		elements[current].focus();
    	}
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileContextMenuOption', slots, []);
    	let { icon = "" } = $$props;
    	let { label = "" } = $$props;
    	let index = 0;
    	let element;

    	onMount(() => {
    		$$invalidate(2, index = elements.length);
    		elements.push(element);

    		if (index === 0) {
    			element === null || element === void 0
    			? void 0
    			: element.focus();
    		}

    		return () => {
    			elements = [];
    			current = 0;
    		};
    	});

    	const writable_props = ['icon', 'label'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileContextMenuOption> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const keydown_handler = e => validateKey(e, index);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({
    		elements,
    		current,
    		validateKey,
    		onMount,
    		icon,
    		label,
    		index,
    		element
    	});

    	$$self.$inject_state = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('index' in $$props) $$invalidate(2, index = $$props.index);
    		if ('element' in $$props) $$invalidate(3, element = $$props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, label, index, element, click_handler, keydown_handler, div_binding];
    }

    class FileContextMenuOption extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { icon: 0, label: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileContextMenuOption",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get icon() {
    		throw new Error("<FileContextMenuOption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<FileContextMenuOption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<FileContextMenuOption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<FileContextMenuOption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\contextmenu\FileContextMenuItem.svelte generated by Svelte v3.44.2 */
    const file$l = "src\\components\\fileBrowser\\contextmenu\\FileContextMenuItem.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (109:8) {#if !option.hide}
    function create_if_block$k(ctx) {
    	let filecontextmenuoption;
    	let current;

    	filecontextmenuoption = new FileContextMenuOption({
    			props: {
    				icon: /*option*/ ctx[9].icon,
    				label: /*option*/ ctx[9].label
    			},
    			$$inline: true
    		});

    	filecontextmenuoption.$on("click", /*option*/ ctx[9].action);

    	const block = {
    		c: function create() {
    			create_component(filecontextmenuoption.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filecontextmenuoption, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filecontextmenuoption.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filecontextmenuoption.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filecontextmenuoption, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(109:8) {#if !option.hide}",
    		ctx
    	});

    	return block;
    }

    // (108:4) {#each options as option}
    function create_each_block$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*option*/ ctx[9].hide && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*option*/ ctx[9].hide) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(108:4) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let current;
    	let each_value = /*options*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file$l, 106, 0, 4287);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options*/ 1) {
    				each_value = /*options*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let isChecked;
    	let $fileContextMenuStore;
    	let $fileDownloadStore;
    	let $fileBrowserStore;
    	validate_store(fileContextMenuStore, 'fileContextMenuStore');
    	component_subscribe($$self, fileContextMenuStore, $$value => $$invalidate(2, $fileContextMenuStore = $$value));
    	validate_store(fileDownloadStore$1, 'fileDownloadStore');
    	component_subscribe($$self, fileDownloadStore$1, $$value => $$invalidate(5, $fileDownloadStore = $$value));
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(6, $fileBrowserStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileContextMenuItem', slots, []);
    	var _a;
    	let { deleteFiles } = $$props;
    	const fileInfo = getContext("fileInfo");

    	let validateBookmark = isBookmark($fileBrowserStore.bookmarks, $fileContextMenuStore === null || $fileContextMenuStore === void 0
    	? void 0
    	: $fileContextMenuStore.item);

    	let options = [
    		{
    			icon: "fas fa-info",
    			action: () => fileInfo($fileContextMenuStore.item),
    			label: "Información",
    			hide: $fileContextMenuStore.item.checked && $fileBrowserStore.numberItemsChecked > 1
    		},
    		{
    			icon: "fas fa-arrow-right",
    			action: () => fileDirectoryStore.setDirectory($fileContextMenuStore.item.route, $fileContextMenuStore.item.name),
    			label: "Ir a ubicación del archivo",
    			hide: !$fileBrowserStore.viewBookmarks || $fileContextMenuStore.item.checked && $fileBrowserStore.numberItemsChecked > 1
    		},
    		{
    			icon: "fas fa-check-square",
    			action: () => fileBrowserStore.setCheck($fileContextMenuStore.item),
    			label: $fileContextMenuStore.item.checked
    			? "Deseleccionar elemento"
    			: "Seleccionar elemento"
    		},
    		{
    			icon: "fas fa-clone",
    			action: () => {
    				fileBrowserStore.setCopy(isChecked
    				? $fileBrowserStore.files.filter(f => f.checked)
    				: [$fileContextMenuStore.item]);

    				fileContextMenuStore.reset();
    			},
    			label: $fileContextMenuStore.item.checked
    			? `Copiar seleccionados`
    			: "Copiar"
    		},
    		{
    			icon: "fas fa-file-export",
    			action: () => {
    				fileBrowserStore.setMove(isChecked
    				? $fileBrowserStore.files.filter(f => f.checked)
    				: [$fileContextMenuStore.item]);

    				fileContextMenuStore.reset();
    			},
    			label: $fileContextMenuStore.item.checked
    			? `Mover seleccionados`
    			: "Mover",
    			hide: $fileBrowserStore.viewBookmarks
    		},
    		{
    			icon: "fas fa-trash",
    			action: () => {
    				let files = isChecked
    				? $fileBrowserStore.files.filter(f => f.checked)
    				: [$fileContextMenuStore.item];

    				deleteFiles(files);
    			},
    			label: $fileContextMenuStore.item.checked
    			? `Eliminar seleccionados`
    			: "Eliminar",
    			hide: $fileBrowserStore.viewBookmarks || $fileDownloadStore.isDownloading
    		},
    		{
    			icon: "fas fa-download",
    			action: () => {
    				let files = isChecked
    				? $fileBrowserStore.files.filter(f => f.checked)
    				: [$fileContextMenuStore.item];

    				fileDownloadStore$1.setDownload(files);

    				FileService.download(files, fileDownloadStore$1.finishDownload, err => {
    					dialogStore$1.showMessage(err.message);
    					fileDownloadStore$1.finishDownload();
    				});
    			},
    			label: $fileContextMenuStore.item.checked
    			? `Descargar seleccionados`
    			: "Descargar",
    			hide: $fileDownloadStore.isDownloading
    		},
    		{
    			icon: "fas fa-star",
    			action: () => fileBrowserStore.updateBookmarks($fileContextMenuStore === null || $fileContextMenuStore === void 0
    			? void 0
    			: $fileContextMenuStore.item),
    			label: `${validateBookmark ? "Quitar de " : "Agregar a "} Marcadores`,
    			hide: $fileContextMenuStore.item.checked || ((_a = $fileContextMenuStore.item) === null || _a === void 0
    			? void 0
    			: _a.isDirectory)
    		}
    	];

    	const writable_props = ['deleteFiles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileContextMenuItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('deleteFiles' in $$props) $$invalidate(1, deleteFiles = $$props.deleteFiles);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		getContext,
    		fileBrowserStore,
    		fileContextMenuStore,
    		fileDirectoryStore,
    		dialogStore: dialogStore$1,
    		fileDownloadStore: fileDownloadStore$1,
    		FileContextMenuOption,
    		isBookmark,
    		FileService,
    		deleteFiles,
    		fileInfo,
    		validateBookmark,
    		options,
    		isChecked,
    		$fileContextMenuStore,
    		$fileDownloadStore,
    		$fileBrowserStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) _a = $$props._a;
    		if ('deleteFiles' in $$props) $$invalidate(1, deleteFiles = $$props.deleteFiles);
    		if ('validateBookmark' in $$props) validateBookmark = $$props.validateBookmark;
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    		if ('isChecked' in $$props) isChecked = $$props.isChecked;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$fileContextMenuStore*/ 4) {
    			isChecked = $fileContextMenuStore.item.checked;
    		}
    	};

    	return [options, deleteFiles, $fileContextMenuStore];
    }

    class FileContextMenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { deleteFiles: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileContextMenuItem",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*deleteFiles*/ ctx[1] === undefined && !('deleteFiles' in props)) {
    			console.warn("<FileContextMenuItem> was created without expected prop 'deleteFiles'");
    		}
    	}

    	get deleteFiles() {
    		throw new Error("<FileContextMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set deleteFiles(value) {
    		throw new Error("<FileContextMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\contextmenu\FileContextMenuParent.svelte generated by Svelte v3.44.2 */

    const file$k = "src\\components\\fileBrowser\\contextmenu\\FileContextMenuParent.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (73:8) {#if !option.hide}
    function create_if_block$j(ctx) {
    	let filecontextmenuoption;
    	let current;

    	filecontextmenuoption = new FileContextMenuOption({
    			props: {
    				icon: /*option*/ ctx[9].icon,
    				label: /*option*/ ctx[9].label
    			},
    			$$inline: true
    		});

    	filecontextmenuoption.$on("click", /*option*/ ctx[9].action);

    	const block = {
    		c: function create() {
    			create_component(filecontextmenuoption.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filecontextmenuoption, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filecontextmenuoption.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filecontextmenuoption.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filecontextmenuoption, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(73:8) {#if !option.hide}",
    		ctx
    	});

    	return block;
    }

    // (72:4) {#each options as option}
    function create_each_block$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*option*/ ctx[9].hide && create_if_block$j(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*option*/ ctx[9].hide) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(72:4) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div;
    	let current;
    	let each_value = /*options*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(div, file$k, 70, 0, 2484);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options*/ 1) {
    				each_value = /*options*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $fileBrowserStore;
    	let $fileDirectoryStore;
    	let $fileContextMenuStore;
    	let $fileDownloadStore;
    	let $fileSettingStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(2, $fileBrowserStore = $$value));
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(3, $fileDirectoryStore = $$value));
    	validate_store(fileContextMenuStore, 'fileContextMenuStore');
    	component_subscribe($$self, fileContextMenuStore, $$value => $$invalidate(4, $fileContextMenuStore = $$value));
    	validate_store(fileDownloadStore$1, 'fileDownloadStore');
    	component_subscribe($$self, fileDownloadStore$1, $$value => $$invalidate(5, $fileDownloadStore = $$value));
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(6, $fileSettingStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileContextMenuParent', slots, []);
    	let { pasteFiles } = $$props;
    	const activateModal = getContext("fileAdd");
    	const fileInfo = getContext("fileInfo");

    	let options = [
    		{
    			icon: "fas fa-folder-plus",
    			action: activateModal,
    			label: "Agregar archivos",
    			hide: $fileBrowserStore.viewBookmarks || $fileDownloadStore.isDownloading
    		},
    		{
    			icon: "fas fa-eye",
    			action: () => {
    				fileSettingStore.setViewOptions();
    				fileBrowserStore.setCheckAll(false);
    			},
    			label: `${$fileSettingStore.viewOptions ? "Ocultar" : "Mostrar"} opciones de archivo`,
    			hide: $fileBrowserStore.numberItems === 0
    		},
    		{
    			icon: "fas fa-check-square",
    			action: () => fileBrowserStore.setCheckAll(!$fileBrowserStore.checkAll),
    			label: $fileBrowserStore.checkAll
    			? "Deseleccionar todos"
    			: "Seleccionar todos",
    			hide: $fileBrowserStore.numberItems === 0
    		},
    		{
    			icon: "fas fa-paste",
    			action: () => {
    				let fileToMove = {
    					files: $fileBrowserStore.clipboard,
    					move: $fileBrowserStore.move,
    					route: $fileDirectoryStore.current
    				};

    				pasteFiles(fileToMove);
    			},
    			label: "Pegar",
    			hide: $fileBrowserStore.clipboard.length === 0 || $fileBrowserStore.clipboard[0].route === $fileDirectoryStore.current || $fileDownloadStore.isDownloading
    		},
    		{
    			icon: "fas fa-info",
    			label: `Información de ${$fileContextMenuStore.parent.name}`,
    			action: () => {
    				let parts = $fileDirectoryStore.current.split("/");
    				let name = parts.pop();

    				fileInfo({
    					isDirectory: true,
    					route: parts.join("/"),
    					name
    				});
    			},
    			hide: $fileBrowserStore.viewBookmarks
    		}
    	];

    	const writable_props = ['pasteFiles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileContextMenuParent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pasteFiles' in $$props) $$invalidate(1, pasteFiles = $$props.pasteFiles);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		fileBrowserStore,
    		fileContextMenuStore,
    		fileDirectoryStore,
    		fileSettingStore,
    		fileDownloadStore: fileDownloadStore$1,
    		FileContextMenuOption,
    		pasteFiles,
    		activateModal,
    		fileInfo,
    		options,
    		$fileBrowserStore,
    		$fileDirectoryStore,
    		$fileContextMenuStore,
    		$fileDownloadStore,
    		$fileSettingStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('pasteFiles' in $$props) $$invalidate(1, pasteFiles = $$props.pasteFiles);
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options, pasteFiles];
    }

    class FileContextMenuParent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { pasteFiles: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileContextMenuParent",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pasteFiles*/ ctx[1] === undefined && !('pasteFiles' in props)) {
    			console.warn("<FileContextMenuParent> was created without expected prop 'pasteFiles'");
    		}
    	}

    	get pasteFiles() {
    		throw new Error("<FileContextMenuParent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pasteFiles(value) {
    		throw new Error("<FileContextMenuParent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\contextmenu\FileContextMenu.svelte generated by Svelte v3.44.2 */

    const file$j = "src\\components\\fileBrowser\\contextmenu\\FileContextMenu.svelte";

    // (87:4) {:else}
    function create_else_block$8(ctx) {
    	let filecontextmenuparent;
    	let current;
    	filecontextmenuparent = new FileContextMenuParent({ props: { pasteFiles }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filecontextmenuparent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filecontextmenuparent, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filecontextmenuparent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filecontextmenuparent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filecontextmenuparent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(87:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (85:4) {#if $fileContextMenuStore.showItem}
    function create_if_block$i(ctx) {
    	let filecontextmenuitem;
    	let current;
    	filecontextmenuitem = new FileContextMenuItem({ props: { deleteFiles }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filecontextmenuitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filecontextmenuitem, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filecontextmenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filecontextmenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filecontextmenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(85:4) {#if $fileContextMenuStore.showItem}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$i, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$fileContextMenuStore*/ ctx[0].showItem) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "context-menu svelte-4xghji");
    			attr_dev(div, "style", div_style_value = `width: ${/*$fileContextMenuStore*/ ctx[0].width}px; top: ${/*$fileContextMenuStore*/ ctx[0].top}px; left: ${/*$fileContextMenuStore*/ ctx[0].left}px;`);
    			add_location(div, file$j, 79, 0, 3131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keydown_handler*/ ctx[2], false, false, false),
    					listen_dev(window, "click", fileContextMenuStore.closeContext, false, false, false),
    					listen_dev(window, "scroll", fileContextMenuStore.closeContext, false, false, false),
    					listen_dev(div, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty & /*$fileContextMenuStore*/ 1 && div_style_value !== (div_style_value = `width: ${/*$fileContextMenuStore*/ ctx[0].width}px; top: ${/*$fileContextMenuStore*/ ctx[0].top}px; left: ${/*$fileContextMenuStore*/ ctx[0].left}px;`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function displayErrors(files, data, callBack) {
    	var _a;

    	let filesAfected = files.filter(f => {
    		var _a;

    		return !((_a = data === null || data === void 0 ? void 0 : data.errors) === null || _a === void 0
    		? void 0
    		: _a.find(err => f.route + f.name === err.route + err.name));
    	});

    	let message = "Se presento un problema al operar los archivos: ";

    	if (((_a = data === null || data === void 0 ? void 0 : data.errors) === null || _a === void 0
    	? void 0
    	: _a.length) > 0) {
    		let complement = "<ul>";
    		data.errors.forEach(e => complement += `<li>${e.name}: ${e.message}</li>`);
    		message += complement + "</ul>";
    	}

    	message += " " + data.message;
    	dialogStore$1.showMessage(message);
    	callBack(filesAfected);
    }

    function deleteFiles(files = []) {
    	let cb = () => {
    		let message = `${files.length} archivos eliminados`;

    		if (files.length === 1) {
    			message = `${files[0].name} fue eliminado`;
    		}

    		dialogStore$1.showMessage(message);
    		fileBrowserStore.setDelete(files);
    	};

    	if (files.length > 0) {
    		dialogStore$1.showDialog(
    			`¿Está seguro de eliminar ${files.length > 1
			? `los ${files.length} elementos seleccionados`
			: ` ${files[0].name}?`}?`,
    			() => {
    				dialogStore$1.showLoading();
    				FileService.delete(files, cb, data => displayErrors(files, data, fileBrowserStore.setDelete));
    			}
    		);
    	} else {
    		dialogStore$1.showMessage("No se ha seleccionado ningún elemento");
    	}
    }

    function pasteFiles(fileData) {
    	let files = fileData.files;

    	let cb = () => {
    		let message = `${files.length} archivos ${fileData.move ? "movidos" : "copiados"}`;

    		if (files.length === 1) {
    			message = `${files[0].name} ${fileData.move ? "movido" : "copiado"}`;
    		}

    		dialogStore$1.showMessage(message);
    		fileBrowserStore.setPaste(files);
    	};

    	if (files.length > 0) {
    		dialogStore$1.showLoading();
    		FileService.paste(fileData, cb, data => displayErrors(files, data, fileBrowserStore.setPaste));
    	} else {
    		dialogStore$1.showMessage("No se ha seleccionado ningún elemento para la operación");
    	}
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let $fileContextMenuStore;
    	validate_store(fileContextMenuStore, 'fileContextMenuStore');
    	component_subscribe($$self, fileContextMenuStore, $$value => $$invalidate(0, $fileContextMenuStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileContextMenu', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileContextMenu> was created with unknown prop '${key}'`);
    	});

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const keydown_handler = e => {
    		if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) {
    			fileContextMenuStore.closeContext();
    		}
    	};

    	$$self.$capture_state = () => ({
    		displayErrors,
    		deleteFiles,
    		pasteFiles,
    		fileContextMenuStore,
    		fileBrowserStore,
    		dialogStore: dialogStore$1,
    		FileContextMenuItem,
    		FileContextMenuParent,
    		FileService,
    		$fileContextMenuStore
    	});

    	return [$fileContextMenuStore, contextmenu_handler, keydown_handler];
    }

    class FileContextMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileContextMenu",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\components\fileBrowser\settings\FileSettingsActions.svelte generated by Svelte v3.44.2 */
    const file$i = "src\\components\\fileBrowser\\settings\\FileSettingsActions.svelte";

    // (29:4) {#if !$fileBrowserStore.viewBookmarks}
    function create_if_block_1$8(ctx) {
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				icon: "fas fa-folder-plus",
    				title: "New Element"
    			},
    			$$inline: true
    		});

    	actionbutton.$on("click", /*activateModal*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(29:4) {#if !$fileBrowserStore.viewBookmarks}",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#if $fileSettingStore.viewOptions && !$fileDownloadStore.isDownloading}
    function create_if_block$h(ctx) {
    	let actionbutton0;
    	let t0;
    	let actionbutton1;
    	let t1;
    	let actionbutton2;
    	let t2;
    	let actionbutton3;
    	let t3;
    	let actionbutton4;
    	let t4;
    	let actionbutton5;
    	let current;

    	actionbutton0 = new ActionButton({
    			props: {
    				icon: "fas fa-check-square",
    				title: "Check",
    				className: /*$fileBrowserStore*/ ctx[0].checkAll
    				? "btn-active"
    				: ""
    			},
    			$$inline: true
    		});

    	actionbutton0.$on("click", /*click_handler*/ ctx[7]);

    	actionbutton1 = new ActionButton({
    			props: {
    				icon: "fas fa-download",
    				title: "Download",
    				disabled: !/*$fileBrowserStore*/ ctx[0].numberItemsChecked
    			},
    			$$inline: true
    		});

    	actionbutton1.$on("click", /*click_handler_1*/ ctx[8]);

    	actionbutton2 = new ActionButton({
    			props: {
    				icon: "fas fa-clone",
    				title: `Copying ${/*$fileBrowserStore*/ ctx[0].clipboard.length && !/*$fileBrowserStore*/ ctx[0].move
				? /*$fileBrowserStore*/ ctx[0].clipboard.length + " elements"
				: ""}`,
    				disabled: !/*$fileBrowserStore*/ ctx[0].numberItemsChecked,
    				className: /*$fileBrowserStore*/ ctx[0].clipboard.length && !/*$fileBrowserStore*/ ctx[0].move
    				? "btn-active"
    				: ""
    			},
    			$$inline: true
    		});

    	actionbutton2.$on("click", /*click_handler_2*/ ctx[9]);

    	actionbutton3 = new ActionButton({
    			props: {
    				icon: "fas fa-file-export",
    				title: `Moving ${/*$fileBrowserStore*/ ctx[0].clipboard.length && /*$fileBrowserStore*/ ctx[0].move
				? /*$fileBrowserStore*/ ctx[0].clipboard.length + " elements"
				: ""}`,
    				disabled: !/*$fileBrowserStore*/ ctx[0].numberItemsChecked,
    				className: /*$fileBrowserStore*/ ctx[0].clipboard.length && /*$fileBrowserStore*/ ctx[0].move
    				? "btn-active"
    				: ""
    			},
    			$$inline: true
    		});

    	actionbutton3.$on("click", /*click_handler_3*/ ctx[10]);

    	actionbutton4 = new ActionButton({
    			props: {
    				icon: "fas fa-paste",
    				title: "Paste",
    				disabled: /*$fileBrowserStore*/ ctx[0].clipboard.length === 0 || /*$fileBrowserStore*/ ctx[0].clipboard[0].route === /*$fileDirectoryStore*/ ctx[1].current
    			},
    			$$inline: true
    		});

    	actionbutton4.$on("click", /*preparePasteFiles*/ ctx[5]);

    	actionbutton5 = new ActionButton({
    			props: {
    				disabled: /*$fileBrowserStore*/ ctx[0].numberItemsChecked <= 0,
    				icon: "fas fa-trash",
    				title: "Eliminate"
    			},
    			$$inline: true
    		});

    	actionbutton5.$on("click", /*prepareDelete*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(actionbutton0.$$.fragment);
    			t0 = space();
    			create_component(actionbutton1.$$.fragment);
    			t1 = space();
    			create_component(actionbutton2.$$.fragment);
    			t2 = space();
    			create_component(actionbutton3.$$.fragment);
    			t3 = space();
    			create_component(actionbutton4.$$.fragment);
    			t4 = space();
    			create_component(actionbutton5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(actionbutton1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(actionbutton2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(actionbutton3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(actionbutton4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(actionbutton5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton0_changes = {};

    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton0_changes.className = /*$fileBrowserStore*/ ctx[0].checkAll
    			? "btn-active"
    			: "";

    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};
    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton1_changes.disabled = !/*$fileBrowserStore*/ ctx[0].numberItemsChecked;
    			actionbutton1.$set(actionbutton1_changes);
    			const actionbutton2_changes = {};

    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton2_changes.title = `Copying ${/*$fileBrowserStore*/ ctx[0].clipboard.length && !/*$fileBrowserStore*/ ctx[0].move
			? /*$fileBrowserStore*/ ctx[0].clipboard.length + " elements"
			: ""}`;

    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton2_changes.disabled = !/*$fileBrowserStore*/ ctx[0].numberItemsChecked;

    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton2_changes.className = /*$fileBrowserStore*/ ctx[0].clipboard.length && !/*$fileBrowserStore*/ ctx[0].move
    			? "btn-active"
    			: "";

    			actionbutton2.$set(actionbutton2_changes);
    			const actionbutton3_changes = {};

    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton3_changes.title = `Moving ${/*$fileBrowserStore*/ ctx[0].clipboard.length && /*$fileBrowserStore*/ ctx[0].move
			? /*$fileBrowserStore*/ ctx[0].clipboard.length + " elements"
			: ""}`;

    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton3_changes.disabled = !/*$fileBrowserStore*/ ctx[0].numberItemsChecked;

    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton3_changes.className = /*$fileBrowserStore*/ ctx[0].clipboard.length && /*$fileBrowserStore*/ ctx[0].move
    			? "btn-active"
    			: "";

    			actionbutton3.$set(actionbutton3_changes);
    			const actionbutton4_changes = {};
    			if (dirty & /*$fileBrowserStore, $fileDirectoryStore*/ 3) actionbutton4_changes.disabled = /*$fileBrowserStore*/ ctx[0].clipboard.length === 0 || /*$fileBrowserStore*/ ctx[0].clipboard[0].route === /*$fileDirectoryStore*/ ctx[1].current;
    			actionbutton4.$set(actionbutton4_changes);
    			const actionbutton5_changes = {};
    			if (dirty & /*$fileBrowserStore*/ 1) actionbutton5_changes.disabled = /*$fileBrowserStore*/ ctx[0].numberItemsChecked <= 0;
    			actionbutton5.$set(actionbutton5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			transition_in(actionbutton2.$$.fragment, local);
    			transition_in(actionbutton3.$$.fragment, local);
    			transition_in(actionbutton4.$$.fragment, local);
    			transition_in(actionbutton5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			transition_out(actionbutton2.$$.fragment, local);
    			transition_out(actionbutton3.$$.fragment, local);
    			transition_out(actionbutton4.$$.fragment, local);
    			transition_out(actionbutton5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(actionbutton1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(actionbutton2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(actionbutton3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(actionbutton4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(actionbutton5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(36:4) {#if $fileSettingStore.viewOptions && !$fileDownloadStore.isDownloading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = !/*$fileBrowserStore*/ ctx[0].viewBookmarks && create_if_block_1$8(ctx);
    	let if_block1 = /*$fileSettingStore*/ ctx[2].viewOptions && !/*$fileDownloadStore*/ ctx[3].isDownloading && create_if_block$h(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(div, file$i, 27, 0, 1074);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*$fileBrowserStore*/ ctx[0].viewBookmarks) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$fileBrowserStore*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$fileSettingStore*/ ctx[2].viewOptions && !/*$fileDownloadStore*/ ctx[3].isDownloading) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$fileSettingStore, $fileDownloadStore*/ 12) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$h(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let prop;
    	let $fileBrowserStore;
    	let $fileDirectoryStore;
    	let $fileSettingStore;
    	let $fileDownloadStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(0, $fileBrowserStore = $$value));
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(1, $fileDirectoryStore = $$value));
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(2, $fileSettingStore = $$value));
    	validate_store(fileDownloadStore$1, 'fileDownloadStore');
    	component_subscribe($$self, fileDownloadStore$1, $$value => $$invalidate(3, $fileDownloadStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileSettingsActions', slots, []);
    	const activateModal = getContext("fileAdd");

    	function preparePasteFiles() {
    		let fileToMove = {
    			files: $fileBrowserStore.clipboard,
    			move: $fileBrowserStore.move,
    			route: $fileDirectoryStore.current
    		};

    		pasteFiles(fileToMove);
    	}

    	function prepareDelete() {
    		deleteFiles($fileBrowserStore[prop].filter(f => f.checked));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileSettingsActions> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => fileBrowserStore.setCheckAll(!$fileBrowserStore.checkAll);

    	const click_handler_1 = () => {
    		let files = $fileBrowserStore.files.filter(f => f.checked);
    		fileDownloadStore$1.setDownload(files);

    		FileService.download(files, fileDownloadStore$1.finishDownload, err => {
    			dialogStore$1.showMessage(err.message);
    			fileDownloadStore$1.finishDownload();
    		});
    	};

    	const click_handler_2 = () => fileBrowserStore.setCopy($fileBrowserStore.files.filter(f => f.checked));
    	const click_handler_3 = () => fileBrowserStore.setMove($fileBrowserStore.files.filter(f => f.checked));

    	$$self.$capture_state = () => ({
    		getContext,
    		fileBrowserStore,
    		fileDirectoryStore,
    		fileSettingStore,
    		fileDownloadStore: fileDownloadStore$1,
    		ActionButton,
    		deleteFiles,
    		pasteFiles,
    		FileService,
    		dialogStore: dialogStore$1,
    		activateModal,
    		preparePasteFiles,
    		prepareDelete,
    		prop,
    		$fileBrowserStore,
    		$fileDirectoryStore,
    		$fileSettingStore,
    		$fileDownloadStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('prop' in $$props) prop = $$props.prop;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$fileBrowserStore*/ 1) {
    			prop = $fileBrowserStore.viewBookmarks ? "bookmarks" : "files";
    		}
    	};

    	return [
    		$fileBrowserStore,
    		$fileDirectoryStore,
    		$fileSettingStore,
    		$fileDownloadStore,
    		activateModal,
    		preparePasteFiles,
    		prepareDelete,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class FileSettingsActions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileSettingsActions",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\commons\Accordion.svelte generated by Svelte v3.44.2 */
    const file$h = "src\\components\\commons\\Accordion.svelte";

    // (37:8) {#if renderDefault || !collapse}
    function create_if_block$g(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(37:8) {#if renderDefault || !collapse}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let t1;
    	let t2;
    	let section;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = (/*renderDefault*/ ctx[4] || !/*collapse*/ ctx[0]) && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			section = element("section");
    			if (if_block) if_block.c();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "name", /*id*/ ctx[2]);
    			attr_dev(input, "id", /*id*/ ctx[2]);
    			attr_dev(input, "class", "svelte-1mu3mtw");
    			add_location(input, file$h, 19, 4, 505);
    			attr_dev(label, "class", "d-block svelte-1mu3mtw");
    			attr_dev(label, "for", /*id*/ ctx[2]);
    			attr_dev(label, "tabindex", "0");
    			toggle_class(label, "text-center", /*labelCenter*/ ctx[5]);
    			add_location(label, file$h, 26, 4, 646);
    			attr_dev(section, "class", "svelte-1mu3mtw");
    			add_location(section, file$h, 35, 4, 842);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty("accordion " + /*cssClass*/ ctx[3]) + " svelte-1mu3mtw"));
    			add_location(div, file$h, 18, 0, 462);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			input.checked = /*collapse*/ ctx[0];
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(div, t2);
    			append_dev(div, section);
    			if (if_block) if_block.m(section, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[10]),
    					listen_dev(input, "change", /*onChange*/ ctx[7], false, false, false),
    					listen_dev(label, "keypress", /*handleFocusEnter*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(input, "name", /*id*/ ctx[2]);
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(input, "id", /*id*/ ctx[2]);
    			}

    			if (dirty & /*collapse*/ 1) {
    				input.checked = /*collapse*/ ctx[0];
    			}

    			if (!current || dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(label, "for", /*id*/ ctx[2]);
    			}

    			if (dirty & /*labelCenter*/ 32) {
    				toggle_class(label, "text-center", /*labelCenter*/ ctx[5]);
    			}

    			if (/*renderDefault*/ ctx[4] || !/*collapse*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*renderDefault, collapse*/ 17) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$g(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*cssClass*/ 8 && div_class_value !== (div_class_value = "" + (null_to_empty("accordion " + /*cssClass*/ ctx[3]) + " svelte-1mu3mtw"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Accordion', slots, ['default']);
    	let { title = "" } = $$props;
    	let { id = "id" } = $$props;
    	let { collapse = false } = $$props;
    	let { cssClass = "" } = $$props;
    	let { renderDefault = true } = $$props;
    	let { labelCenter = false } = $$props;
    	const dispatch = createEventDispatcher();

    	function handleFocusEnter(e) {
    		if (e.key === "Enter") {
    			$$invalidate(0, collapse = !collapse);
    		}
    	}

    	function onChange() {
    		dispatch("change", { collapse });
    	}

    	const writable_props = ['title', 'id', 'collapse', 'cssClass', 'renderDefault', 'labelCenter'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Accordion> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		collapse = this.checked;
    		$$invalidate(0, collapse);
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('collapse' in $$props) $$invalidate(0, collapse = $$props.collapse);
    		if ('cssClass' in $$props) $$invalidate(3, cssClass = $$props.cssClass);
    		if ('renderDefault' in $$props) $$invalidate(4, renderDefault = $$props.renderDefault);
    		if ('labelCenter' in $$props) $$invalidate(5, labelCenter = $$props.labelCenter);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		title,
    		id,
    		collapse,
    		cssClass,
    		renderDefault,
    		labelCenter,
    		dispatch,
    		handleFocusEnter,
    		onChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('collapse' in $$props) $$invalidate(0, collapse = $$props.collapse);
    		if ('cssClass' in $$props) $$invalidate(3, cssClass = $$props.cssClass);
    		if ('renderDefault' in $$props) $$invalidate(4, renderDefault = $$props.renderDefault);
    		if ('labelCenter' in $$props) $$invalidate(5, labelCenter = $$props.labelCenter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		collapse,
    		title,
    		id,
    		cssClass,
    		renderDefault,
    		labelCenter,
    		handleFocusEnter,
    		onChange,
    		$$scope,
    		slots,
    		input_change_handler
    	];
    }

    class Accordion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			title: 1,
    			id: 2,
    			collapse: 0,
    			cssClass: 3,
    			renderDefault: 4,
    			labelCenter: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accordion",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get title() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get collapse() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set collapse(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cssClass() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cssClass(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderDefault() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderDefault(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelCenter() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelCenter(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\commons\InputFile.svelte generated by Svelte v3.44.2 */
    const file$g = "src\\components\\commons\\InputFile.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (70:16) {#each filesSelected as file}
    function create_each_block_1$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*file*/ ctx[18].name + "";
    	let t0;
    	let t1;
    	let td1;
    	let button;
    	let i;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[12](/*file*/ ctx[18]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			button = element("button");
    			i = element("i");
    			t2 = space();
    			attr_dev(td0, "class", "t-left svelte-cp77h5");
    			add_location(td0, file$g, 71, 24, 2374);
    			attr_dev(i, "class", "fas fa-trash-alt");
    			add_location(i, file$g, 77, 32, 2689);
    			attr_dev(button, "class", "inp-type disable pointer");
    			add_location(button, file$g, 73, 28, 2469);
    			attr_dev(td1, "class", "svelte-cp77h5");
    			add_location(td1, file$g, 72, 24, 2435);
    			add_location(tr, file$g, 70, 20, 2344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, button);
    			append_dev(button, i);
    			append_dev(tr, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(click_handler_1), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*filesSelected*/ 1 && t0_value !== (t0_value = /*file*/ ctx[18].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(70:16) {#each filesSelected as file}",
    		ctx
    	});

    	return block;
    }

    // (86:4) {#each errors as err}
    function create_each_block$6(ctx) {
    	let div;
    	let t0;
    	let t1_value = /*err*/ ctx[15] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("* ");
    			t1 = text(t1_value);
    			attr_dev(div, "class", "form-field-error m-t-4 f-08");
    			add_location(div, file$g, 86, 8, 2930);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errors*/ 2 && t1_value !== (t1_value = /*err*/ ctx[15] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(86:4) {#each errors as err}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div2;
    	let label;
    	let t1;
    	let div1;
    	let div0;
    	let i0;
    	let t2;
    	let i1;
    	let t3;
    	let input;
    	let t4;
    	let table;
    	let tbody;
    	let t5;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*filesSelected*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*errors*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			label = element("label");
    			label.textContent = "Archivos";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t2 = space();
    			i1 = element("i");
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			table = element("table");
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(label, "for", "file");
    			add_location(label, file$g, 44, 4, 1398);
    			attr_dev(i0, "class", "fas fa-plus");
    			add_location(i0, file$g, 57, 12, 1961);
    			attr_dev(i1, "class", "fas fa-file");
    			add_location(i1, file$g, 58, 12, 2000);
    			attr_dev(div0, "class", "file-entry white pointer svelte-cp77h5");
    			attr_dev(div0, "tabindex", "0");
    			attr_dev(div0, "draggable", "");
    			toggle_class(div0, "dragOn", /*dragOn*/ ctx[2]);
    			add_location(div0, file$g, 46, 8, 1504);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "name", "file");
    			input.multiple = true;
    			attr_dev(input, "class", "svelte-cp77h5");
    			add_location(input, file$g, 60, 8, 2051);
    			add_location(tbody, file$g, 68, 12, 2268);
    			attr_dev(table, "class", "tbl w-100 f-09 svelte-cp77h5");
    			add_location(table, file$g, 67, 8, 2224);
    			attr_dev(div1, "class", "form-field");
    			set_style(div1, "flex-direction", "column");
    			add_location(div1, file$g, 45, 4, 1438);
    			attr_dev(div2, "class", "form-field-control");
    			add_location(div2, file$g, 43, 0, 1360);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i0);
    			append_dev(div0, t2);
    			append_dev(div0, i1);
    			append_dev(div1, t3);
    			append_dev(div1, input);
    			/*input_binding*/ ctx[11](input);
    			append_dev(div1, t4);
    			append_dev(div1, table);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tbody, null);
    			}

    			append_dev(div2, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(div0, "keydown", /*keydown_handler*/ ctx[8], false, false, false),
    					listen_dev(div0, "dragenter", prevent_default(/*dragenter_handler*/ ctx[9]), false, true, false),
    					listen_dev(div0, "drop", prevent_default(/*handleDrop*/ ctx[5]), false, true, false),
    					listen_dev(div0, "dragover", prevent_default(/*dragover_handler*/ ctx[10]), false, true, false),
    					listen_dev(input, "change", /*handleChange*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dragOn*/ 4) {
    				toggle_class(div0, "dragOn", /*dragOn*/ ctx[2]);
    			}

    			if (dirty & /*removeFile, filesSelected*/ 17) {
    				each_value_1 = /*filesSelected*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*errors*/ 2) {
    				each_value = /*errors*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*input_binding*/ ctx[11](null);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $fileBrowserStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(13, $fileBrowserStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputFile', slots, []);
    	let { filesSelected = [] } = $$props;
    	let { errors = [] } = $$props;
    	let dragOn = false;
    	let inputFile;

    	function addFiles(inputFiles) {
    		$$invalidate(1, errors = []);

    		inputFiles.forEach(file => {
    			if (!filesSelected.find(f => f.name === file.name)) {
    				if ($fileBrowserStore.files.find(f => f.name === file.name)) {
    					errors.push(`El archivo ${file.name} ya existe en la ruta`);
    				} else {
    					$$invalidate(0, filesSelected = [...filesSelected, file]);
    				}
    			}
    		});
    	}

    	function removeFile(file) {
    		$$invalidate(0, filesSelected = filesSelected.filter(f => f.name !== file.name));
    	}

    	function handleDrop(dragEvent) {
    		let files = [];

    		if (dragEvent.dataTransfer.items) {
    			for (let i = 0; i < dragEvent.dataTransfer.items.length; i++) {
    				if (dragEvent.dataTransfer.items[i].kind === "file") {
    					files.push(dragEvent.dataTransfer.items[i].getAsFile());
    				}
    			}
    		} else {
    			for (let i = 0; i < dragEvent.dataTransfer.files.length; i++) {
    				files.push(dragEvent.dataTransfer.files[i]);
    			}
    		}

    		addFiles(files);
    	}

    	function handleChange() {
    		let files = Array.from(inputFile.files);
    		addFiles(files);
    	}

    	const writable_props = ['filesSelected', 'errors'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputFile> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => inputFile.click();
    	const keydown_handler = e => e.key === "Enter" ? inputFile.click() : null;
    	const dragenter_handler = () => $$invalidate(2, dragOn = true);
    	const dragover_handler = () => $$invalidate(2, dragOn = false);

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputFile = $$value;
    			$$invalidate(3, inputFile);
    		});
    	}

    	const click_handler_1 = file => removeFile(file);

    	$$self.$$set = $$props => {
    		if ('filesSelected' in $$props) $$invalidate(0, filesSelected = $$props.filesSelected);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    	};

    	$$self.$capture_state = () => ({
    		fileBrowserStore,
    		filesSelected,
    		errors,
    		dragOn,
    		inputFile,
    		addFiles,
    		removeFile,
    		handleDrop,
    		handleChange,
    		$fileBrowserStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('filesSelected' in $$props) $$invalidate(0, filesSelected = $$props.filesSelected);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('dragOn' in $$props) $$invalidate(2, dragOn = $$props.dragOn);
    		if ('inputFile' in $$props) $$invalidate(3, inputFile = $$props.inputFile);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		filesSelected,
    		errors,
    		dragOn,
    		inputFile,
    		removeFile,
    		handleDrop,
    		handleChange,
    		click_handler,
    		keydown_handler,
    		dragenter_handler,
    		dragover_handler,
    		input_binding,
    		click_handler_1
    	];
    }

    class InputFile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { filesSelected: 0, errors: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputFile",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get filesSelected() {
    		throw new Error("<InputFile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filesSelected(value) {
    		throw new Error("<InputFile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errors() {
    		throw new Error("<InputFile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errors(value) {
    		throw new Error("<InputFile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\forms\FileForm.svelte generated by Svelte v3.44.2 */
    const file$f = "src\\components\\fileBrowser\\forms\\FileForm.svelte";

    // (95:4) {:else}
    function create_else_block$7(ctx) {
    	let inputfile;
    	let updating_errors;
    	let updating_filesSelected;
    	let current;

    	function inputfile_errors_binding(value) {
    		/*inputfile_errors_binding*/ ctx[11](value);
    	}

    	function inputfile_filesSelected_binding(value) {
    		/*inputfile_filesSelected_binding*/ ctx[12](value);
    	}

    	let inputfile_props = {};

    	if (/*errors*/ ctx[1].files !== void 0) {
    		inputfile_props.errors = /*errors*/ ctx[1].files;
    	}

    	if (/*values*/ ctx[0].files !== void 0) {
    		inputfile_props.filesSelected = /*values*/ ctx[0].files;
    	}

    	inputfile = new InputFile({ props: inputfile_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputfile, 'errors', inputfile_errors_binding));
    	binding_callbacks.push(() => bind(inputfile, 'filesSelected', inputfile_filesSelected_binding));

    	const block = {
    		c: function create() {
    			create_component(inputfile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputfile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputfile_changes = {};

    			if (!updating_errors && dirty & /*errors*/ 2) {
    				updating_errors = true;
    				inputfile_changes.errors = /*errors*/ ctx[1].files;
    				add_flush_callback(() => updating_errors = false);
    			}

    			if (!updating_filesSelected && dirty & /*values*/ 1) {
    				updating_filesSelected = true;
    				inputfile_changes.filesSelected = /*values*/ ctx[0].files;
    				add_flush_callback(() => updating_filesSelected = false);
    			}

    			inputfile.$set(inputfile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputfile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputfile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputfile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(95:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:4) {#if values.type === "folder"}
    function create_if_block_1$7(ctx) {
    	let inputtext;
    	let updating_value;
    	let updating_errors;
    	let current;

    	function inputtext_value_binding(value) {
    		/*inputtext_value_binding*/ ctx[9](value);
    	}

    	function inputtext_errors_binding(value) {
    		/*inputtext_errors_binding*/ ctx[10](value);
    	}

    	let inputtext_props = {
    		name: "name",
    		label: "Nombre",
    		regex: FileBrowser$1.regexp.folderName
    	};

    	if (/*values*/ ctx[0].name !== void 0) {
    		inputtext_props.value = /*values*/ ctx[0].name;
    	}

    	if (/*errors*/ ctx[1].name !== void 0) {
    		inputtext_props.errors = /*errors*/ ctx[1].name;
    	}

    	inputtext = new InputText({ props: inputtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputtext, 'value', inputtext_value_binding));
    	binding_callbacks.push(() => bind(inputtext, 'errors', inputtext_errors_binding));

    	const block = {
    		c: function create() {
    			create_component(inputtext.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputtext, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputtext_changes = {};

    			if (!updating_value && dirty & /*values*/ 1) {
    				updating_value = true;
    				inputtext_changes.value = /*values*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_errors && dirty & /*errors*/ 2) {
    				updating_errors = true;
    				inputtext_changes.errors = /*errors*/ ctx[1].name;
    				add_flush_callback(() => updating_errors = false);
    			}

    			inputtext.$set(inputtext_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputtext, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(87:4) {#if values.type === \\\"folder\\\"}",
    		ctx
    	});

    	return block;
    }

    // (101:4) {#if finalError}
    function create_if_block$f(ctx) {
    	let div;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("* ");
    			t1 = text(/*finalError*/ ctx[2]);
    			attr_dev(div, "class", "f-08");
    			set_style(div, "color", "red");
    			add_location(div, file$f, 101, 8, 3373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*finalError*/ 4) set_data_dev(t1, /*finalError*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(101:4) {#if finalError}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let form;
    	let div1;
    	let label0;
    	let t1;
    	let div0;
    	let span;
    	let t2_value = /*$fileDirectoryStore*/ ctx[4].current + "";
    	let t2;
    	let t3;
    	let div3;
    	let label1;
    	let t5;
    	let div2;
    	let select;
    	let option0;
    	let option1;
    	let t8;
    	let current_block_type_index;
    	let if_block0;
    	let t9;
    	let t10;
    	let div4;
    	let button0;
    	let t12;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$7, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*values*/ ctx[0].type === "folder") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*finalError*/ ctx[2] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Ruta";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Tipo de elemento";
    			t5 = space();
    			div2 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Folder";
    			option1 = element("option");
    			option1.textContent = "Archivo";
    			t8 = space();
    			if_block0.c();
    			t9 = space();
    			if (if_block1) if_block1.c();
    			t10 = space();
    			div4 = element("div");
    			button0 = element("button");
    			button0.textContent = "Agregar";
    			t12 = space();
    			button1 = element("button");
    			button1.textContent = "Cancelar";
    			attr_dev(label0, "for", "type");
    			add_location(label0, file$f, 64, 8, 2229);
    			attr_dev(span, "class", "inp-type disable p-3 w-100 f-08 t-left");
    			add_location(span, file$f, 66, 12, 2307);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file$f, 65, 8, 2269);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file$f, 63, 4, 2187);
    			attr_dev(label1, "for", "type");
    			add_location(label1, file$f, 72, 8, 2504);
    			option0.__value = "folder";
    			option0.value = option0.__value;
    			add_location(option0, file$f, 81, 16, 2805);
    			option1.__value = "file";
    			option1.value = option1.__value;
    			add_location(option1, file$f, 82, 16, 2861);
    			attr_dev(select, "id", "type");
    			attr_dev(select, "class", "w-100");
    			attr_dev(select, "name", "type");
    			if (/*values*/ ctx[0].type === void 0) add_render_callback(() => /*select_change_handler*/ ctx[7].call(select));
    			add_location(select, file$f, 74, 12, 2594);
    			attr_dev(div2, "class", "form-field");
    			add_location(div2, file$f, 73, 8, 2556);
    			attr_dev(div3, "class", "form-field-control");
    			add_location(div3, file$f, 71, 4, 2462);
    			attr_dev(button0, "type", "submit");
    			attr_dev(button0, "class", "btn m-auto w-25");
    			add_location(button0, file$f, 106, 8, 3520);
    			attr_dev(button1, "class", "btn m-auto w-25");
    			add_location(button1, file$f, 107, 8, 3592);
    			attr_dev(div4, "class", "form-field-control d-flex");
    			add_location(div4, file$f, 105, 4, 3471);
    			add_location(form, file$f, 62, 0, 2135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(form, t3);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*values*/ ctx[0].type);
    			/*select_binding*/ ctx[8](select);
    			append_dev(form, t8);
    			if_blocks[current_block_type_index].m(form, null);
    			append_dev(form, t9);
    			if (if_block1) if_block1.m(form, null);
    			append_dev(form, t10);
    			append_dev(form, div4);
    			append_dev(div4, button0);
    			append_dev(div4, t12);
    			append_dev(div4, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[7]),
    					listen_dev(button1, "click", prevent_default(/*closeModal*/ ctx[5]), false, true, false),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[6]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$fileDirectoryStore*/ 16) && t2_value !== (t2_value = /*$fileDirectoryStore*/ ctx[4].current + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*values*/ 1) {
    				select_option(select, /*values*/ ctx[0].type);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(form, t9);
    			}

    			if (/*finalError*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$f(ctx);
    					if_block1.c();
    					if_block1.m(form, t10);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			/*select_binding*/ ctx[8](null);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $fileDirectoryStore;
    	let $fileBrowserStore;
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(4, $fileDirectoryStore = $$value));
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(13, $fileBrowserStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileForm', slots, []);
    	const closeModal = getContext("closeModal");
    	const blockModal = getContext("blockModal");

    	let values = {
    		type: "folder",
    		name: "",
    		files: [],
    		route: $fileDirectoryStore.current
    	};

    	let errors = { name: "", files: [] };
    	let finalError = "";
    	let focusElement;

    	function handleSubmit() {
    		var _a;

    		const cb = () => {
    			if (values.type === "folder") {
    				fileDirectoryStore.setDirectory($fileDirectoryStore.current + "/" + values.name);
    			} else {
    				fileBrowserStore.setFiles(
    					[
    						...$fileBrowserStore.files,
    						...mapCustomFiles(values === null || values === void 0
    						? void 0
    						: values.files)
    					],
    					$fileDirectoryStore.current
    				);
    			}

    			blockModal(false);
    			closeModal();
    		};

    		const err = err => {
    			blockModal(false);
    			$$invalidate(2, finalError = err.message);

    			setTimeout(
    				() => {
    					$$invalidate(2, finalError = "");
    				},
    				10000
    			);
    		};

    		if (values.type === "folder") {
    			if (((_a = values === null || values === void 0
    			? void 0
    			: values.name) === null || _a === void 0
    			? void 0
    			: _a.trim().length) === 0) {
    				$$invalidate(1, errors.name = `* El campo es obligatorio`, errors);
    				return;
    			}
    		}

    		if (values.type === "file") {
    			if ((values === null || values === void 0
    			? void 0
    			: values.files.length) === 0) {
    				$$invalidate(1, errors.files = [`* El campo es obligatorio`], errors);
    				return;
    			}
    		}

    		blockModal(true);
    		FileService.create(values, cb, err);
    	}

    	onMount(() => focusElement.focus());
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileForm> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		values.type = select_value(this);
    		$$invalidate(0, values);
    	}

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			focusElement = $$value;
    			$$invalidate(3, focusElement);
    		});
    	}

    	function inputtext_value_binding(value) {
    		if ($$self.$$.not_equal(values.name, value)) {
    			values.name = value;
    			$$invalidate(0, values);
    		}
    	}

    	function inputtext_errors_binding(value) {
    		if ($$self.$$.not_equal(errors.name, value)) {
    			errors.name = value;
    			$$invalidate(1, errors);
    		}
    	}

    	function inputfile_errors_binding(value) {
    		if ($$self.$$.not_equal(errors.files, value)) {
    			errors.files = value;
    			$$invalidate(1, errors);
    		}
    	}

    	function inputfile_filesSelected_binding(value) {
    		if ($$self.$$.not_equal(values.files, value)) {
    			values.files = value;
    			$$invalidate(0, values);
    		}
    	}

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		fileDirectoryStore,
    		fileBrowserStore,
    		InputText,
    		InputFile,
    		FileService,
    		mapCustomFiles,
    		FileBrowser: FileBrowser$1,
    		closeModal,
    		blockModal,
    		values,
    		errors,
    		finalError,
    		focusElement,
    		handleSubmit,
    		$fileDirectoryStore,
    		$fileBrowserStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('values' in $$props) $$invalidate(0, values = $$props.values);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('finalError' in $$props) $$invalidate(2, finalError = $$props.finalError);
    		if ('focusElement' in $$props) $$invalidate(3, focusElement = $$props.focusElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		values,
    		errors,
    		finalError,
    		focusElement,
    		$fileDirectoryStore,
    		closeModal,
    		handleSubmit,
    		select_change_handler,
    		select_binding,
    		inputtext_value_binding,
    		inputtext_errors_binding,
    		inputfile_errors_binding,
    		inputfile_filesSelected_binding
    	];
    }

    class FileForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileForm",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\components\fileBrowser\settings\FileSettings.svelte generated by Svelte v3.44.2 */
    const file$e = "src\\components\\fileBrowser\\settings\\FileSettings.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (44:4) {#if $fileContextMenuStore.active}
    function create_if_block_1$6(ctx) {
    	let filecontextmenu;
    	let current;
    	filecontextmenu = new FileContextMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filecontextmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filecontextmenu, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filecontextmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filecontextmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filecontextmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(44:4) {#if $fileContextMenuStore.active}",
    		ctx
    	});

    	return block;
    }

    // (64:24) {#each FileBrowser.sortOptions as option}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[15].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*option*/ ctx[15].value;
    			option.value = option.__value;
    			add_location(option, file$e, 64, 28, 2575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(64:24) {#each FileBrowser.sortOptions as option}",
    		ctx
    	});

    	return block;
    }

    // (90:24) {#each FileBrowser.groupOptions as option}
    function create_each_block$5(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[15].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*option*/ ctx[15].value;
    			option.value = option.__value;
    			add_location(option, file$e, 90, 28, 3736);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(90:24) {#each FileBrowser.groupOptions as option}",
    		ctx
    	});

    	return block;
    }

    // (47:4) <Accordion          {title}          id="sortGroup"          renderDefault={false}          bind:collapse={isToolbarCollapsed}          on:change={() => fileToolbarCollapsedStore.set(isToolbarCollapsed)}          cssClass="f-09"      >
    function create_default_slot_1$1(ctx) {
    	let div6;
    	let div1;
    	let label0;
    	let t1;
    	let div0;
    	let select0;
    	let select0_value_value;
    	let t2;
    	let actionbutton0;
    	let t3;
    	let actionbutton1;
    	let t4;
    	let div3;
    	let label1;
    	let t6;
    	let div2;
    	let select1;
    	let select1_value_value;
    	let t7;
    	let div5;
    	let div4;
    	let input;
    	let input_checked_value;
    	let t8;
    	let label2;
    	let t10;
    	let filesettingsactions;
    	let div6_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = FileBrowser$1.sortOptions;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	actionbutton0 = new ActionButton({
    			props: {
    				icon: `fas fa-sort-amount-${/*$fileSettingStore*/ ctx[4].orderAsc ? "down" : "up"}-alt`
    			},
    			$$inline: true
    		});

    	actionbutton0.$on("click", fileSettingStore.setOrderAsc);

    	actionbutton1 = new ActionButton({
    			props: {
    				icon: `fas fa-${/*$fileSettingStore*/ ctx[4].viewList ? "list" : "th"}`
    			},
    			$$inline: true
    		});

    	actionbutton1.$on("click", fileSettingStore.setView);
    	let each_value = FileBrowser$1.groupOptions;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	filesettingsactions = new FileSettingsActions({ $$inline: true });

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Ordenamiento";
    			t1 = space();
    			div0 = element("div");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			create_component(actionbutton0.$$.fragment);
    			t3 = space();
    			create_component(actionbutton1.$$.fragment);
    			t4 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Agrupación";
    			t6 = space();
    			div2 = element("div");
    			select1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			div5 = element("div");
    			div4 = element("div");
    			input = element("input");
    			t8 = space();
    			label2 = element("label");
    			label2.textContent = "Opciones de archivo";
    			t10 = space();
    			create_component(filesettingsactions.$$.fragment);
    			attr_dev(label0, "for", "select-sort");
    			add_location(label0, file$e, 56, 16, 2185);
    			attr_dev(select0, "id", "select-sort");
    			add_location(select0, file$e, 58, 20, 2294);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file$e, 57, 16, 2248);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file$e, 55, 12, 2135);
    			attr_dev(label1, "for", "select-sort");
    			add_location(label1, file$e, 82, 16, 3345);
    			attr_dev(select1, "id", "select-sort");
    			add_location(select1, file$e, 84, 20, 3452);
    			attr_dev(div2, "class", "form-field");
    			add_location(div2, file$e, 83, 16, 3406);
    			attr_dev(div3, "class", "form-field-control");
    			add_location(div3, file$e, 81, 12, 3295);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "check");
    			attr_dev(input, "id", "individualMark");
    			input.checked = input_checked_value = /*$fileSettingStore*/ ctx[4].viewOptions;
    			add_location(input, file$e, 97, 20, 4014);
    			attr_dev(label2, "for", "individualMark");
    			add_location(label2, file$e, 107, 20, 4458);
    			attr_dev(div4, "class", "options-title w-100 svelte-1dhhxb7");
    			add_location(div4, file$e, 96, 16, 3959);
    			attr_dev(div5, "class", "options-aditional svelte-1dhhxb7");
    			add_location(div5, file$e, 95, 12, 3910);
    			attr_dev(div6, "class", "options-wrapper svelte-1dhhxb7");
    			add_location(div6, file$e, 54, 8, 2077);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*$fileSettingStore*/ ctx[4].sortBy);
    			append_dev(div0, t2);
    			mount_component(actionbutton0, div0, null);
    			append_dev(div0, t3);
    			mount_component(actionbutton1, div0, null);
    			append_dev(div6, t4);
    			append_dev(div6, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, select1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*$fileSettingStore*/ ctx[4].groupBy);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, input);
    			append_dev(div4, t8);
    			append_dev(div4, label2);
    			append_dev(div5, t10);
    			mount_component(filesettingsactions, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*handleSortChange*/ ctx[5], false, false, false),
    					listen_dev(select1, "change", /*handleGroupChange*/ ctx[6], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*FileBrowser*/ 0) {
    				each_value_1 = FileBrowser$1.sortOptions;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (!current || dirty & /*$fileSettingStore, FileBrowser*/ 16 && select0_value_value !== (select0_value_value = /*$fileSettingStore*/ ctx[4].sortBy)) {
    				select_option(select0, /*$fileSettingStore*/ ctx[4].sortBy);
    			}

    			const actionbutton0_changes = {};
    			if (dirty & /*$fileSettingStore*/ 16) actionbutton0_changes.icon = `fas fa-sort-amount-${/*$fileSettingStore*/ ctx[4].orderAsc ? "down" : "up"}-alt`;
    			actionbutton0.$set(actionbutton0_changes);
    			const actionbutton1_changes = {};
    			if (dirty & /*$fileSettingStore*/ 16) actionbutton1_changes.icon = `fas fa-${/*$fileSettingStore*/ ctx[4].viewList ? "list" : "th"}`;
    			actionbutton1.$set(actionbutton1_changes);

    			if (dirty & /*FileBrowser*/ 0) {
    				each_value = FileBrowser$1.groupOptions;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*$fileSettingStore, FileBrowser*/ 16 && select1_value_value !== (select1_value_value = /*$fileSettingStore*/ ctx[4].groupBy)) {
    				select_option(select1, /*$fileSettingStore*/ ctx[4].groupBy);
    			}

    			if (!current || dirty & /*$fileSettingStore, FileBrowser*/ 16 && input_checked_value !== (input_checked_value = /*$fileSettingStore*/ ctx[4].viewOptions)) {
    				prop_dev(input, "checked", input_checked_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			transition_in(filesettingsactions.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div6_transition) div6_transition = create_bidirectional_transition(div6, fly, {}, true);
    				div6_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			transition_out(filesettingsactions.$$.fragment, local);
    			if (!div6_transition) div6_transition = create_bidirectional_transition(div6, fly, {}, false);
    			div6_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_each(each_blocks_1, detaching);
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(filesettingsactions);
    			if (detaching && div6_transition) div6_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(47:4) <Accordion          {title}          id=\\\"sortGroup\\\"          renderDefault={false}          bind:collapse={isToolbarCollapsed}          on:change={() => fileToolbarCollapsedStore.set(isToolbarCollapsed)}          cssClass=\\\"f-09\\\"      >",
    		ctx
    	});

    	return block;
    }

    // (114:4) {#if newFile}
    function create_if_block$e(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				icon: "fas fa-plus",
    				label: "Agregar elemento",
    				onClose: /*func*/ ctx[12],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};
    			if (dirty & /*newFile*/ 2) modal_changes.onClose = /*func*/ ctx[12];

    			if (dirty & /*$$scope*/ 1048576) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(114:4) {#if newFile}",
    		ctx
    	});

    	return block;
    }

    // (115:8) <Modal              icon="fas fa-plus"              label="Agregar elemento"              onClose={() => (newFile = false)}          >
    function create_default_slot$5(ctx) {
    	let fileform;
    	let current;
    	fileform = new FileForm({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fileform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileform, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(115:8) <Modal              icon=\\\"fas fa-plus\\\"              label=\\\"Agregar elemento\\\"              onClose={() => (newFile = false)}          >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let section;
    	let t0;
    	let accordion;
    	let updating_collapse;
    	let t1;
    	let current;
    	let if_block0 = /*$fileContextMenuStore*/ ctx[3].active && create_if_block_1$6(ctx);

    	function accordion_collapse_binding(value) {
    		/*accordion_collapse_binding*/ ctx[10](value);
    	}

    	let accordion_props = {
    		title: /*title*/ ctx[2],
    		id: "sortGroup",
    		renderDefault: false,
    		cssClass: "f-09",
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	if (/*isToolbarCollapsed*/ ctx[0] !== void 0) {
    		accordion_props.collapse = /*isToolbarCollapsed*/ ctx[0];
    	}

    	accordion = new Accordion({ props: accordion_props, $$inline: true });
    	binding_callbacks.push(() => bind(accordion, 'collapse', accordion_collapse_binding));
    	accordion.$on("change", /*change_handler_1*/ ctx[11]);
    	let if_block1 = /*newFile*/ ctx[1] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(accordion.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(section, "class", "file-grid-options");
    			add_location(section, file$e, 42, 0, 1711);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			mount_component(accordion, section, null);
    			append_dev(section, t1);
    			if (if_block1) if_block1.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$fileContextMenuStore*/ ctx[3].active) {
    				if (if_block0) {
    					if (dirty & /*$fileContextMenuStore*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const accordion_changes = {};
    			if (dirty & /*title*/ 4) accordion_changes.title = /*title*/ ctx[2];

    			if (dirty & /*$$scope, $fileSettingStore*/ 1048592) {
    				accordion_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_collapse && dirty & /*isToolbarCollapsed*/ 1) {
    				updating_collapse = true;
    				accordion_changes.collapse = /*isToolbarCollapsed*/ ctx[0];
    				add_flush_callback(() => updating_collapse = false);
    			}

    			accordion.$set(accordion_changes);

    			if (/*newFile*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*newFile*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$e(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(accordion.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(accordion.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			destroy_component(accordion);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let title;
    	let $fileBrowserStore;
    	let $fileToolbarCollapsedStore;
    	let $fileContextMenuStore;
    	let $fileSettingStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(8, $fileBrowserStore = $$value));
    	validate_store(fileToolbarCollapsedStore, 'fileToolbarCollapsedStore');
    	component_subscribe($$self, fileToolbarCollapsedStore, $$value => $$invalidate(13, $fileToolbarCollapsedStore = $$value));
    	validate_store(fileContextMenuStore, 'fileContextMenuStore');
    	component_subscribe($$self, fileContextMenuStore, $$value => $$invalidate(3, $fileContextMenuStore = $$value));
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(4, $fileSettingStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileSettings', slots, []);
    	let { numberItemsFiltered = 0 } = $$props;
    	let { isToolbarCollapsed = $fileToolbarCollapsedStore } = $$props;
    	let newFile = false;

    	function activateNewFile() {
    		$$invalidate(1, newFile = true);
    	}

    	function handleSortChange(e) {
    		let value = e.target.value;
    		fileSettingStore.setSortBy(value);
    	}

    	function handleGroupChange(e) {
    		let value = e.target.value;
    		fileSettingStore.setGroupBy(value);
    	}

    	setContext("fileAdd", activateNewFile);
    	const writable_props = ['numberItemsFiltered', 'isToolbarCollapsed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileSettings> was created with unknown prop '${key}'`);
    	});

    	const change_handler = () => {
    		fileSettingStore.setViewOptions();
    		fileBrowserStore.setCheckAll(false);
    	};

    	function accordion_collapse_binding(value) {
    		isToolbarCollapsed = value;
    		$$invalidate(0, isToolbarCollapsed);
    	}

    	const change_handler_1 = () => fileToolbarCollapsedStore.set(isToolbarCollapsed);
    	const func = () => $$invalidate(1, newFile = false);

    	$$self.$$set = $$props => {
    		if ('numberItemsFiltered' in $$props) $$invalidate(7, numberItemsFiltered = $$props.numberItemsFiltered);
    		if ('isToolbarCollapsed' in $$props) $$invalidate(0, isToolbarCollapsed = $$props.isToolbarCollapsed);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		setContext,
    		fileBrowserStore,
    		fileContextMenuStore,
    		fileSettingStore,
    		fileToolbarCollapsedStore,
    		FileContextMenu,
    		FileSettingsActions,
    		Accordion,
    		ActionButton,
    		FileBrowser: FileBrowser$1,
    		Modal,
    		FileForm,
    		numberItemsFiltered,
    		isToolbarCollapsed,
    		newFile,
    		activateNewFile,
    		handleSortChange,
    		handleGroupChange,
    		title,
    		$fileBrowserStore,
    		$fileToolbarCollapsedStore,
    		$fileContextMenuStore,
    		$fileSettingStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('numberItemsFiltered' in $$props) $$invalidate(7, numberItemsFiltered = $$props.numberItemsFiltered);
    		if ('isToolbarCollapsed' in $$props) $$invalidate(0, isToolbarCollapsed = $$props.isToolbarCollapsed);
    		if ('newFile' in $$props) $$invalidate(1, newFile = $$props.newFile);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$fileBrowserStore, numberItemsFiltered*/ 384) {
    			$$invalidate(2, title = "Vista" + ($fileBrowserStore.numberItems > 0 && !$fileBrowserStore.waiting
    			? ` | ${$fileBrowserStore.numberItems} elementos ${$fileBrowserStore.filter
				? ` | ${numberItemsFiltered} filtrados`
				: ""} ${$fileBrowserStore.numberItemsChecked
				? ` | ${$fileBrowserStore.numberItemsChecked} seleccionados`
				: ""}`
    			: ""));
    		}
    	};

    	return [
    		isToolbarCollapsed,
    		newFile,
    		title,
    		$fileContextMenuStore,
    		$fileSettingStore,
    		handleSortChange,
    		handleGroupChange,
    		numberItemsFiltered,
    		$fileBrowserStore,
    		change_handler,
    		accordion_collapse_binding,
    		change_handler_1,
    		func
    	];
    }

    class FileSettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			numberItemsFiltered: 7,
    			isToolbarCollapsed: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileSettings",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get numberItemsFiltered() {
    		throw new Error("<FileSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberItemsFiltered(value) {
    		throw new Error("<FileSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isToolbarCollapsed() {
    		throw new Error("<FileSettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isToolbarCollapsed(value) {
    		throw new Error("<FileSettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\FileToolBar.svelte generated by Svelte v3.44.2 */
    const file$d = "src\\components\\fileBrowser\\FileToolBar.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let filepath;
    	let t;
    	let filesettings;
    	let current;
    	filepath = new FilePath({ $$inline: true });

    	filesettings = new FileSettings({
    			props: {
    				numberItemsFiltered: /*numberItemsFiltered*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(filepath.$$.fragment);
    			t = space();
    			create_component(filesettings.$$.fragment);
    			attr_dev(div, "class", "browser-toolbar svelte-1rdunl2");
    			add_location(div, file$d, 5, 0, 176);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(filepath, div, null);
    			append_dev(div, t);
    			mount_component(filesettings, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const filesettings_changes = {};
    			if (dirty & /*numberItemsFiltered*/ 1) filesettings_changes.numberItemsFiltered = /*numberItemsFiltered*/ ctx[0];
    			filesettings.$set(filesettings_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filepath.$$.fragment, local);
    			transition_in(filesettings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filepath.$$.fragment, local);
    			transition_out(filesettings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(filepath);
    			destroy_component(filesettings);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileToolBar', slots, []);
    	let { numberItemsFiltered = 0 } = $$props;
    	const writable_props = ['numberItemsFiltered'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileToolBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('numberItemsFiltered' in $$props) $$invalidate(0, numberItemsFiltered = $$props.numberItemsFiltered);
    	};

    	$$self.$capture_state = () => ({
    		FilePath,
    		FileSettings,
    		numberItemsFiltered
    	});

    	$$self.$inject_state = $$props => {
    		if ('numberItemsFiltered' in $$props) $$invalidate(0, numberItemsFiltered = $$props.numberItemsFiltered);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [numberItemsFiltered];
    }

    class FileToolBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { numberItemsFiltered: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileToolBar",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get numberItemsFiltered() {
    		throw new Error("<FileToolBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numberItemsFiltered(value) {
    		throw new Error("<FileToolBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const initialState$2 = {
        startHeight: 0,
        endHeight: window.innerHeight,
        previewY: 0,
        updateScroll: false,
        previousHeight: 0
    };
    function createScrollStore() {
        const { subscribe, set, update } = writable(initialState$2);
        return {
            subscribe,
            setCurrentHeight: (start, end) => update((s) => (Object.assign(Object.assign({}, s), { startHeight: start, endHeight: end }))),
            setPreviousHeight: (previousHeight) => update((s) => (Object.assign(Object.assign({}, s), { previousHeight: previousHeight }))),
            triggerPrevious: () => update((s) => (Object.assign(Object.assign({}, s), { updateScroll: true }))),
            restore: () => update((s) => (Object.assign(Object.assign({}, s), { updateScroll: false, previousHeight: 0, previewY: 0 }))),
            setPreviewHeight: (previewY) => update((s) => (Object.assign(Object.assign({}, s), { previewY: previewY }))),
            reset: () => set(initialState$2)
        };
    }
    var scrollStore = createScrollStore();

    /* src\components\fileBrowser\FileLayout.svelte generated by Svelte v3.44.2 */
    const file$c = "src\\components\\fileBrowser\\FileLayout.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (47:4) {#if $fileDownloadStore.isDownloading}
    function create_if_block$d(ctx) {
    	let div;
    	let accordion;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;

    	accordion = new Accordion({
    			props: {
    				title: "Descargando...",
    				id: "downloads-fb",
    				collapse: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(accordion.$$.fragment);
    			attr_dev(div, "class", "download-alert scroll svelte-qd4w4a");
    			add_location(div, file$c, 47, 8, 1693);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(accordion, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "contextmenu", stop_propagation(prevent_default(/*contextmenu_handler*/ ctx[8])), false, true, true);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const accordion_changes = {};

    			if (dirty & /*$$scope, $fileDownloadStore*/ 2080) {
    				accordion_changes.$$scope = { dirty, ctx };
    			}

    			accordion.$set(accordion_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordion.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordion.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(accordion);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(47:4) {#if $fileDownloadStore.isDownloading}",
    		ctx
    	});

    	return block;
    }

    // (54:16) {#each $fileDownloadStore.files as file}
    function create_each_block$4(ctx) {
    	let div;
    	let i;
    	let i_class_value;
    	let t0;
    	let t1_value = /*file*/ ctx[12].name + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(`fas fa-${/*file*/ ctx[12].isDirectory ? "folder" : "file"} m-1`) + " svelte-qd4w4a"));
    			add_location(i, file$c, 55, 24, 2057);
    			attr_dev(div, "class", "download-element svelte-qd4w4a");
    			add_location(div, file$c, 54, 20, 2001);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$fileDownloadStore*/ 32 && i_class_value !== (i_class_value = "" + (null_to_empty(`fas fa-${/*file*/ ctx[12].isDirectory ? "folder" : "file"} m-1`) + " svelte-qd4w4a"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*$fileDownloadStore*/ 32 && t1_value !== (t1_value = /*file*/ ctx[12].name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(54:16) {#each $fileDownloadStore.files as file}",
    		ctx
    	});

    	return block;
    }

    // (53:12) <Accordion title="Descargando..." id="downloads-fb" collapse={true}>
    function create_default_slot$4(ctx) {
    	let each_1_anchor;
    	let each_value = /*$fileDownloadStore*/ ctx[5].files;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$fileDownloadStore*/ 32) {
    				each_value = /*$fileDownloadStore*/ ctx[5].files;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(53:12) <Accordion title=\\\"Descargando...\\\" id=\\\"downloads-fb\\\" collapse={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let section_1;
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let if_block = /*$fileDownloadStore*/ ctx[5].isDownloading && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			section_1 = element("section");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "browser-layout svelte-qd4w4a");
    			toggle_class(div, "active", !/*$fileToolbarCollapsed*/ ctx[4] && /*$scrollStore*/ ctx[1].startHeight < 16 * 8);
    			add_location(div, file$c, 39, 4, 1469);
    			attr_dev(section_1, "class", "scroll svelte-qd4w4a");
    			add_location(section_1, file$c, 21, 0, 916);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section_1, anchor);
    			append_dev(section_1, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(section_1, t);
    			if (if_block) if_block.m(section_1, null);
    			/*section_1_binding*/ ctx[9](section_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(section_1, "scroll", /*scrollAction*/ ctx[6], false, false, false),
    					listen_dev(section_1, "contextmenu", stop_propagation(prevent_default(/*contextmenu_handler_1*/ ctx[10])), false, true, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$fileToolbarCollapsed, $scrollStore*/ 18) {
    				toggle_class(div, "active", !/*$fileToolbarCollapsed*/ ctx[4] && /*$scrollStore*/ ctx[1].startHeight < 16 * 8);
    			}

    			if (/*$fileDownloadStore*/ ctx[5].isDownloading) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$fileDownloadStore*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(section_1, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section_1);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*section_1_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $scrollStore;
    	let $fileBrowserStore;
    	let $fileDirectoryStore;
    	let $fileToolbarCollapsed;
    	let $fileDownloadStore;
    	validate_store(scrollStore, 'scrollStore');
    	component_subscribe($$self, scrollStore, $$value => $$invalidate(1, $scrollStore = $$value));
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(2, $fileBrowserStore = $$value));
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(3, $fileDirectoryStore = $$value));
    	validate_store(fileToolbarCollapsedStore, 'fileToolbarCollapsed');
    	component_subscribe($$self, fileToolbarCollapsedStore, $$value => $$invalidate(4, $fileToolbarCollapsed = $$value));
    	validate_store(fileDownloadStore$1, 'fileDownloadStore');
    	component_subscribe($$self, fileDownloadStore$1, $$value => $$invalidate(5, $fileDownloadStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileLayout', slots, ['default']);
    	let section;

    	let scrollAction = e => {
    		let target = e.target;
    		fileContextMenuStore.closeContext();
    		scrollStore.setCurrentHeight(target.scrollTop, target.clientHeight + target.scrollTop);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileLayout> was created with unknown prop '${key}'`);
    	});

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function section_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			section = $$value;
    			$$invalidate(0, section);
    		});
    	}

    	const contextmenu_handler_1 = ({ pageX, pageY }) => {
    		if (!$fileBrowserStore.error) {
    			fileContextMenuStore.showContextParent(
    				{
    					route: $fileDirectoryStore.current,
    					name: getLastTreeName($fileDirectoryStore.current),
    					isDirectory: true
    				},
    				pageX,
    				pageY
    			);
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fileBrowserStore,
    		fileContextMenuStore,
    		fileDirectoryStore,
    		fileDownloadStore: fileDownloadStore$1,
    		scrollStore,
    		fileToolbarCollapsed: fileToolbarCollapsedStore,
    		Accordion,
    		getLastTreeName,
    		section,
    		scrollAction,
    		$scrollStore,
    		$fileBrowserStore,
    		$fileDirectoryStore,
    		$fileToolbarCollapsed,
    		$fileDownloadStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('section' in $$props) $$invalidate(0, section = $$props.section);
    		if ('scrollAction' in $$props) $$invalidate(6, scrollAction = $$props.scrollAction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$scrollStore, section*/ 3) {
    			if ($scrollStore.updateScroll) {
    				section.scroll({ top: $scrollStore.previousHeight });
    				scrollStore.restore();
    			}
    		}
    	};

    	return [
    		section,
    		$scrollStore,
    		$fileBrowserStore,
    		$fileDirectoryStore,
    		$fileToolbarCollapsed,
    		$fileDownloadStore,
    		scrollAction,
    		slots,
    		contextmenu_handler,
    		section_1_binding,
    		contextmenu_handler_1,
    		$$scope
    	];
    }

    class FileLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileLayout",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    const initialState$1 = new Map();
    function filePreviewStore() {
        const { subscribe, set, update } = writable(initialState$1);
        return {
            subscribe,
            setPreview: (key, preview) => update(map => {
                map.set(key, preview);
                return map;
            }),
            removePreview: (key) => update(map => {
                map.delete(key);
                return map;
            }),
            reset: () => set(initialState$1)
        };
    }
    var filePreviewStore$1 = filePreviewStore();

    const initialState = {
        windowWidth: 0,
        itemWidth: 0,
        perRow: 0,
        gap: 0,
        previousSet: false
    };
    function createfileGridGapStore() {
        const { subscribe, set, update } = writable(initialState);
        function calculatePerRow(itemWidth) {
            let scrollAprox = 9;
            let width = window.innerWidth - scrollAprox;
            let perRow = Math.trunc(width / Math.round(itemWidth));
            let gap = width % itemWidth;
            gap = Math.trunc((gap / perRow));
            return { itemWidth, windowWidth: width, perRow, gap };
        }
        return {
            subscribe,
            setGridInfo: (itemWidth) => update(() => (Object.assign(Object.assign({}, calculatePerRow(itemWidth)), { previousSet: true }))),
            updateGridInfo: () => update((s) => {
                if (s.previousSet) {
                    return (Object.assign(Object.assign({}, calculatePerRow(s.itemWidth)), { previousSet: true }));
                }
                return s;
            }),
            reset: () => set(initialState)
        };
    }
    var fileGridCssStore = createfileGridGapStore();

    /* src\components\fileBrowser\grid\FileGridItem.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;
    const file_1$4 = "src\\components\\fileBrowser\\grid\\FileGridItem.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "file-item svelte-1xoyhur");
    			attr_dev(div, "style", /*style*/ ctx[4]);
    			attr_dev(div, "tabindex", "0");
    			toggle_class(div, "bookmark", isBookmark(/*$fileBrowserStore*/ ctx[3].bookmarks, /*file*/ ctx[0]));
    			toggle_class(div, "moving", /*$fileBrowserStore*/ ctx[3].clipboard.find(/*func*/ ctx[17]) && /*$fileBrowserStore*/ ctx[3].move);
    			toggle_class(div, "selected", /*file*/ ctx[0].checked);
    			toggle_class(div, "list", /*list*/ ctx[1]);
    			toggle_class(div, "grid", !/*list*/ ctx[1]);
    			add_location(div, file_1$4, 160, 0, 4971);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "contextmenu", stop_propagation(prevent_default(/*contextmenu_handler*/ ctx[16])), false, true, true),
    					listen_dev(div, "click", /*processItem*/ ctx[5], false, false, false),
    					listen_dev(div, "keydown", /*validateKey*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*style*/ 16) {
    				attr_dev(div, "style", /*style*/ ctx[4]);
    			}

    			if (dirty & /*isBookmark, $fileBrowserStore, file*/ 9) {
    				toggle_class(div, "bookmark", isBookmark(/*$fileBrowserStore*/ ctx[3].bookmarks, /*file*/ ctx[0]));
    			}

    			if (dirty & /*$fileBrowserStore, file*/ 9) {
    				toggle_class(div, "moving", /*$fileBrowserStore*/ ctx[3].clipboard.find(/*func*/ ctx[17]) && /*$fileBrowserStore*/ ctx[3].move);
    			}

    			if (dirty & /*file*/ 1) {
    				toggle_class(div, "selected", /*file*/ ctx[0].checked);
    			}

    			if (dirty & /*list*/ 2) {
    				toggle_class(div, "list", /*list*/ ctx[1]);
    			}

    			if (dirty & /*list*/ 2) {
    				toggle_class(div, "grid", !/*list*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    /**
     * Control focus on elements
     */
    const map = new Map();

    function focusItem(key, idx) {
    	var _a;

    	(_a = map.get(key + idx)) === null || _a === void 0
    	? void 0
    	: _a.focus();
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $fileDirectoryStore;
    	let $fileBrowserStore;
    	let $filePreviewStore;
    	let $fileGridCssStore;
    	let $scrollStore;
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(11, $fileDirectoryStore = $$value));
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(3, $fileBrowserStore = $$value));
    	validate_store(filePreviewStore$1, 'filePreviewStore');
    	component_subscribe($$self, filePreviewStore$1, $$value => $$invalidate(12, $filePreviewStore = $$value));
    	validate_store(fileGridCssStore, 'fileGridCssStore');
    	component_subscribe($$self, fileGridCssStore, $$value => $$invalidate(18, $fileGridCssStore = $$value));
    	validate_store(scrollStore, 'scrollStore');
    	component_subscribe($$self, scrollStore, $$value => $$invalidate(19, $scrollStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileGridItem', slots, ['default']);
    	var _a, _b;
    	let { file } = $$props;
    	let { viewItem } = $$props;
    	let { list = false } = $$props;
    	const key = getContext("id");
    	let element;
    	let style = "";
    	let backFocusedFlag = false;

    	function validateScroll(target) {
    		if (!$filePreviewStore.get(key)) {
    			setTimeout(
    				() => {
    					let boundingClientTarget = target.getBoundingClientRect();
    					scrollStore.setPreviewHeight(boundingClientTarget.y - boundingClientTarget.height);
    				},
    				500
    			);
    		} else {
    			scrollStore.setPreviewHeight(0);
    		}
    	}

    	function processItem(e) {
    		validateScroll(e.target);
    		map.get(key + file.idxFocus).focus();

    		if (file.isDirectory) {
    			fileDirectoryStore.setDirectory($fileDirectoryStore.current + "/" + file.name);
    		} else if (FileBrowser$1.visor.includes(file.type)) {
    			scrollStore.setPreviousHeight($scrollStore.startHeight);
    			viewItem(file);
    		} else {
    			console.log("download");
    		}
    	}

    	function focusNext() {
    		let idxTarget = file.idxFocus + 1;
    		if (idxTarget < $fileBrowserStore.numberItems) focusItem(key, idxTarget);
    	}

    	function focusPrev() {
    		let idxTarget = file.idxFocus - 1;
    		if (idxTarget >= 0) focusItem(key, idxTarget);
    	}

    	function focusDown() {
    		if (list) {
    			focusNext();
    		} else {
    			if (!$filePreviewStore.get(key)) {
    				let newIdx = file.idxFocus + $fileGridCssStore.perRow;

    				if (newIdx < $fileBrowserStore.numberItems) {
    					focusItem(key, newIdx);
    				} else {
    					focusItem(key, $fileBrowserStore.numberItems - 1);
    				}
    			}
    		}
    	}

    	function focusUp() {
    		if (list) {
    			focusPrev();
    		} else {
    			if (!$filePreviewStore.get(key)) {
    				let newIdx = file.idxFocus - $fileGridCssStore.perRow;

    				if (newIdx > 0) {
    					focusItem(key, newIdx);
    				} else {
    					focusItem(key, 0);
    				}
    			}
    		}
    	}

    	function validateKey(e) {
    		switch (e.key) {
    			case "Enter":
    				return processItem(e);
    			case "Delete":
    				return $fileBrowserStore.viewBookmarks
    				? null
    				: deleteFiles(file.checked
    					? $fileBrowserStore.files.filter(f => f.checked)
    					: [file]);
    			case "ArrowRight":
    				return focusNext();
    			case "ArrowLeft":
    				return focusPrev();
    			case "ArrowDown":
    				e.preventDefault();
    				return focusDown();
    			case "ArrowUp":
    				e.preventDefault();
    				return focusUp();
    			case "C":
    			case "c":
    				return fileBrowserStore.setCheck(file);
    			case "M":
    			case "m":
    				return file.checked || file.isDirectory
    				? null
    				: fileBrowserStore.updateBookmarks(file);
    			default:
    				return;
    		}
    	}

    	onMount(() => {
    		if (file.idxFocus === 0) {
    			if (!$fileGridCssStore.previousSet) {
    				fileGridCssStore.setGridInfo(element.getBoundingClientRect().width);
    			}

    			if (!$fileDirectoryStore.itemFocus) {
    				element.focus();
    			}
    		}

    		map.set(key + file.idxFocus, element);
    		return () => map.delete(key + file.idxFocus);
    	});

    	const writable_props = ['file', 'viewItem', 'list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<FileGridItem> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	const contextmenu_handler = ({ pageX, pageY }) => {
    		element.focus();
    		fileContextMenuStore.showContextItem(file, pageX, pageY);
    	};

    	const func = f => f.route + f.name === file.route + file.name;

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('viewItem' in $$props) $$invalidate(7, viewItem = $$props.viewItem);
    		if ('list' in $$props) $$invalidate(1, list = $$props.list);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		_b,
    		map,
    		focusItem,
    		_a,
    		_b,
    		getContext,
    		onMount,
    		fileBrowserStore,
    		filePreviewStore: filePreviewStore$1,
    		fileDirectoryStore,
    		fileContextMenuStore,
    		fileGridCssStore,
    		scrollStore,
    		FileBrowser: FileBrowser$1,
    		deleteFiles,
    		isBookmark,
    		file,
    		viewItem,
    		list,
    		key,
    		element,
    		style,
    		backFocusedFlag,
    		validateScroll,
    		processItem,
    		focusNext,
    		focusPrev,
    		focusDown,
    		focusUp,
    		validateKey,
    		$fileDirectoryStore,
    		$fileBrowserStore,
    		$filePreviewStore,
    		$fileGridCssStore,
    		$scrollStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('_a' in $$props) $$invalidate(8, _a = $$props._a);
    		if ('_b' in $$props) $$invalidate(9, _b = $$props._b);
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('viewItem' in $$props) $$invalidate(7, viewItem = $$props.viewItem);
    		if ('list' in $$props) $$invalidate(1, list = $$props.list);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('style' in $$props) $$invalidate(4, style = $$props.style);
    		if ('backFocusedFlag' in $$props) $$invalidate(10, backFocusedFlag = $$props.backFocusedFlag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$filePreviewStore, _a, _b, file, element*/ 4869) {
    			//move focus on preview
    			if (($$invalidate(8, _a = $filePreviewStore.get(key)) === null || _a === void 0
    			? void 0
    			: _a.route) + ($$invalidate(9, _b = $filePreviewStore.get(key)) === null || _b === void 0
    			? void 0
    			: _b.name) === file.route + file.name) {
    				$$invalidate(4, style = `background-color: #0c9aaa66;`);

    				element === null || element === void 0
    				? void 0
    				: element.focus();
    			} else {
    				$$invalidate(4, style = "");
    			}
    		}

    		if ($$self.$$.dirty & /*$fileBrowserStore, file, $fileDirectoryStore, backFocusedFlag, element*/ 3085) {
    			//focus on previous folder
    			if (!$fileBrowserStore.filter && file.name === $fileDirectoryStore.itemFocus && !backFocusedFlag) {
    				$$invalidate(10, backFocusedFlag = true);

    				element === null || element === void 0
    				? void 0
    				: element.focus();
    			}
    		}
    	};

    	return [
    		file,
    		list,
    		element,
    		$fileBrowserStore,
    		style,
    		processItem,
    		validateKey,
    		viewItem,
    		_a,
    		_b,
    		backFocusedFlag,
    		$fileDirectoryStore,
    		$filePreviewStore,
    		$$scope,
    		slots,
    		div_binding,
    		contextmenu_handler,
    		func
    	];
    }

    class FileGridItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { file: 0, viewItem: 7, list: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileGridItem",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console_1.warn("<FileGridItem> was created without expected prop 'file'");
    		}

    		if (/*viewItem*/ ctx[7] === undefined && !('viewItem' in props)) {
    			console_1.warn("<FileGridItem> was created without expected prop 'viewItem'");
    		}
    	}

    	get file() {
    		throw new Error("<FileGridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<FileGridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewItem() {
    		throw new Error("<FileGridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewItem(value) {
    		throw new Error("<FileGridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get list() {
    		throw new Error("<FileGridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<FileGridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\grid\FileGridItemPreview.svelte generated by Svelte v3.44.2 */

    const file_1$3 = "src\\components\\fileBrowser\\grid\\FileGridItemPreview.svelte";

    // (19:0) {:else}
    function create_else_block$6(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-file-image file-img-preview svelte-1lm2htn");
    			add_location(i, file_1$3, 19, 4, 355);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(19:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if !error}
    function create_if_block$c(ctx) {
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "loading", "lazy");
    			if (!src_url_equal(img.src, img_src_value = /*icon*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*name*/ ctx[0]);
    			attr_dev(img, "class", "file-img-preview svelte-1lm2htn");
    			add_location(img, file_1$3, 11, 4, 188);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = listen_dev(img, "error", /*error_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 2 && !src_url_equal(img.src, img_src_value = /*icon*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*name*/ 1) {
    				attr_dev(img, "alt", /*name*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(11:0) {#if !error}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (!/*error*/ ctx[2]) return create_if_block$c;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileGridItemPreview', slots, []);
    	let { file } = $$props;
    	let icon;
    	let name;
    	let error = false;
    	const writable_props = ['file'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileGridItemPreview> was created with unknown prop '${key}'`);
    	});

    	const error_handler = e => $$invalidate(2, error = true);

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(3, file = $$props.file);
    	};

    	$$self.$capture_state = () => ({ file, icon, name, error });

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(3, file = $$props.file);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*file, name*/ 9) {
    			if (file.name !== name) {
    				$$invalidate(1, icon = file.icon);
    				$$invalidate(0, name = file.name);
    			}
    		}
    	};

    	return [name, icon, error, file, error_handler];
    }

    class FileGridItemPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { file: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileGridItemPreview",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[3] === undefined && !('file' in props)) {
    			console.warn("<FileGridItemPreview> was created without expected prop 'file'");
    		}
    	}

    	get file() {
    		throw new Error("<FileGridItemPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<FileGridItemPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\grid\FileGridItemBar.svelte generated by Svelte v3.44.2 */
    const file_1$2 = "src\\components\\fileBrowser\\grid\\FileGridItemBar.svelte";

    // (23:8) {#if !file.isDirectory}
    function create_if_block$b(ctx) {
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				className: isBookmark(/*$fileBrowserStore*/ ctx[2].bookmarks, /*file*/ ctx[0])
    				? "btn-active"
    				: "",
    				title: "Marcador",
    				icon: "far fa-star",
    				small: true
    			},
    			$$inline: true
    		});

    	actionbutton.$on("click", /*click_handler_1*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const actionbutton_changes = {};

    			if (dirty & /*$fileBrowserStore, file*/ 5) actionbutton_changes.className = isBookmark(/*$fileBrowserStore*/ ctx[2].bookmarks, /*file*/ ctx[0])
    			? "btn-active"
    			: "";

    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(23:8) {#if !file.isDirectory}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div1;
    	let div0;
    	let actionbutton;
    	let t0;
    	let t1;
    	let input;
    	let input_checked_value;
    	let current;
    	let mounted;
    	let dispose;

    	actionbutton = new ActionButton({
    			props: {
    				title: "Information",
    				icon: "fas fa-info",
    				small: true
    			},
    			$$inline: true
    		});

    	actionbutton.$on("click", /*click_handler*/ ctx[4]);
    	let if_block = !/*file*/ ctx[0].isDirectory && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(actionbutton.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			input = element("input");
    			attr_dev(div0, "class", "d-flex m-r-auto");
    			add_location(div0, file_1$2, 15, 4, 452);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "check svelte-1fqhyfv");
    			input.checked = input_checked_value = /*file*/ ctx[0].checked;
    			add_location(input, file_1$2, 34, 4, 1071);
    			attr_dev(div1, "class", "file-options svelte-1fqhyfv");
    			toggle_class(div1, "list", /*list*/ ctx[1]);
    			toggle_class(div1, "grid", !/*list*/ ctx[1]);
    			add_location(div1, file_1$2, 9, 0, 330);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(actionbutton, div0, null);
    			append_dev(div0, t0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[6], false, false, false),
    					listen_dev(div1, "click", stop_propagation(click_handler_2), false, false, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*file*/ ctx[0].isDirectory) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*file*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*file*/ 1 && input_checked_value !== (input_checked_value = /*file*/ ctx[0].checked)) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*list*/ 2) {
    				toggle_class(div1, "list", /*list*/ ctx[1]);
    			}

    			if (dirty & /*list*/ 2) {
    				toggle_class(div1, "grid", !/*list*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(actionbutton);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler_2 = () => null;

    function instance$e($$self, $$props, $$invalidate) {
    	let $fileBrowserStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(2, $fileBrowserStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileGridItemBar', slots, []);
    	let { file } = $$props;
    	let { list } = $$props;
    	const fileInfo = getContext("fileInfo");
    	const writable_props = ['file', 'list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileGridItemBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => fileInfo(file);
    	const click_handler_1 = () => fileBrowserStore.updateBookmarks(file);
    	const change_handler = () => fileBrowserStore.setCheck(file);

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('list' in $$props) $$invalidate(1, list = $$props.list);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		fileBrowserStore,
    		ActionButton,
    		isBookmark,
    		file,
    		list,
    		fileInfo,
    		$fileBrowserStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('list' in $$props) $$invalidate(1, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		file,
    		list,
    		$fileBrowserStore,
    		fileInfo,
    		click_handler,
    		click_handler_1,
    		change_handler
    	];
    }

    class FileGridItemBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { file: 0, list: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileGridItemBar",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console.warn("<FileGridItemBar> was created without expected prop 'file'");
    		}

    		if (/*list*/ ctx[1] === undefined && !('list' in props)) {
    			console.warn("<FileGridItemBar> was created without expected prop 'list'");
    		}
    	}

    	get file() {
    		throw new Error("<FileGridItemBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<FileGridItemBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get list() {
    		throw new Error("<FileGridItemBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<FileGridItemBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function setDateFormatStr(dateStr = '', format = "") {
        try {
            return setDateFormat(new Date(dateStr), format);
        }
        catch (e) {
            return null;
        }
    }
    function groupByDateClasification(date) {
        let today = new Date();
        let difDays = today.getDate() - date.getDate();
        switch (true) {
            case difDays === 0 &&
                today.getMonth() === date.getMonth() &&
                today.getFullYear() === date.getFullYear():
                return "Hoy";
            case difDays < 7 &&
                today.getDay() > date.getDay() &&
                today.getMonth() === date.getMonth() &&
                today.getFullYear() === date.getFullYear():
                return "Esta Semana";
            case today.getMonth() === date.getMonth() &&
                today.getFullYear() === date.getFullYear():
                return "Este Mes";
            case today.getMonth() - 1 === date.getMonth() &&
                today.getFullYear() === date.getFullYear():
                return "Mes Previo";
            case today.getFullYear() === date.getFullYear():
                return "Este año";
            default:
                return "Hace mucho tiempo";
        }
    }
    function setDateFormat(date = new Date(), format = "dd/mm/yyyy") {
        const currentMonth = date.getMonth();
        const currentHour = date.getHours();
        const months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        const days = [
            "Lunes",
            "Martes",
            "Miercoles",
            "Jueves",
            "Viernes",
            "Sabado",
            "Domingo",
        ];
        const keys = [
            { label: "YYYY", value: date.getFullYear().toString() },
            { label: "yyyy", value: date.getFullYear().toString() },
            { label: "YY", value: String(date.getFullYear()).substring(0, 2) },
            { label: "yy", value: String(date.getFullYear()).substring(0, 2) },
            { label: "MONTH", value: months[currentMonth].toUpperCase() },
            { label: "month", value: months[currentMonth] },
            {
                label: "MMM",
                value: months[currentMonth].toUpperCase().substring(0, 3),
            },
            { label: "mmm", value: months[currentMonth].substring(0, 3) },
            { label: "MM", value: String(currentMonth + 1).padStart(2, "0") },
            { label: "mm", value: String(currentMonth + 1).padStart(2, "0") },
            { label: "DAY", value: days[date.getDay()] },
            { label: "DD", value: String(date.getDate()).padStart(2, "0") },
            { label: "dd", value: String(date.getDate()).padStart(2, "0") },
            { label: "HH24", value: String(currentHour).padStart(2, "0") },
            {
                label: "HH",
                value: String(currentHour > 12 ? currentHour - 12 : currentHour).padStart(2, "0"),
            },
            {
                label: "AMPM",
                value: String(currentHour > 12 ? "PM" : "AM").padStart(2, "0"),
            },
            {
                label: "ampm",
                value: String(currentHour > 12 ? "pm" : "am").padStart(2, "0"),
            },
            { label: "MI", value: String(date.getMinutes()).padStart(2, "0") },
            { label: "SS", value: String(date.getSeconds()).padStart(2, "0") },
        ];
        keys.forEach((key) => {
            format = format.replace(key.label, key.value);
        });
        return format;
    }

    /* src\components\fileBrowser\grid\FileGrid.svelte generated by Svelte v3.44.2 */

    const { Object: Object_1$2 } = globals;
    const file$b = "src\\components\\fileBrowser\\grid\\FileGrid.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[13] = i;
    	return child_ctx;
    }

    // (79:16) {:else}
    function create_else_block$5(ctx) {
    	let i;
    	let i_class_value;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*file*/ ctx[11].icon) + " svelte-1cl0ppd"));
    			add_location(i, file$b, 79, 20, 3178);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderFiles*/ 4 && i_class_value !== (i_class_value = "" + (null_to_empty(/*file*/ ctx[11].icon) + " svelte-1cl0ppd"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(79:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (73:37) 
    function create_if_block_3$1(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*file*/ ctx[11].icon)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*file*/ ctx[11].name);
    			attr_dev(img, "class", "file-img-icon svelte-1cl0ppd");
    			add_location(img, file$b, 73, 20, 2974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderFiles*/ 4 && !src_url_equal(img.src, img_src_value = /*file*/ ctx[11].icon)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*orderFiles*/ 4 && img_alt_value !== (img_alt_value = /*file*/ ctx[11].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(73:37) ",
    		ctx
    	});

    	return block;
    }

    // (71:16) {#if file.preview}
    function create_if_block_2$4(ctx) {
    	let filegriditempreview;
    	let current;

    	filegriditempreview = new FileGridItemPreview({
    			props: { file: /*file*/ ctx[11] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(filegriditempreview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filegriditempreview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filegriditempreview_changes = {};
    			if (dirty & /*orderFiles*/ 4) filegriditempreview_changes.file = /*file*/ ctx[11];
    			filegriditempreview.$set(filegriditempreview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filegriditempreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filegriditempreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filegriditempreview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(71:16) {#if file.preview}",
    		ctx
    	});

    	return block;
    }

    // (88:12) {#if !file.isDirectory && file.size !== undefined}
    function create_if_block_1$5(ctx) {
    	let div;
    	let t_value = getSizeMb(/*file*/ ctx[11].size) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "file-data svelte-1cl0ppd");
    			add_location(div, file$b, 88, 16, 3542);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*orderFiles*/ 4 && t_value !== (t_value = getSizeMb(/*file*/ ctx[11].size) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(88:12) {#if !file.isDirectory && file.size !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (93:12) {#if $fileSettingStore.viewOptions}
    function create_if_block$a(ctx) {
    	let filegriditembar;
    	let current;

    	filegriditembar = new FileGridItemBar({
    			props: {
    				file: /*file*/ ctx[11],
    				list: /*list*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(filegriditembar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filegriditembar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filegriditembar_changes = {};
    			if (dirty & /*orderFiles*/ 4) filegriditembar_changes.file = /*file*/ ctx[11];
    			if (dirty & /*list*/ 8) filegriditembar_changes.list = /*list*/ ctx[3];
    			filegriditembar.$set(filegriditembar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filegriditembar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filegriditembar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filegriditembar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(93:12) {#if $fileSettingStore.viewOptions}",
    		ctx
    	});

    	return block;
    }

    // (65:8) <FileGridItem              file={{ ...file, index, idxFocus: parentIndex + index }}              {viewItem}              {list}          >
    function create_default_slot$3(ctx) {
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let div1;
    	let span;
    	let t1_value = limitString(/*file*/ ctx[11].name, /*list*/ ctx[3] ? 60 : 30, "...") + "";
    	let t1;
    	let div1_title_value;
    	let t2;
    	let t3;
    	let div2;
    	let t4_value = setDateFormatStr(/*file*/ ctx[11].creation) + "";
    	let t4;
    	let t5;
    	let div3;
    	let t6_value = setDateFormatStr(/*file*/ ctx[11].modification) + "";
    	let t6;
    	let t7;
    	let t8;
    	let current;
    	const if_block_creators = [create_if_block_2$4, create_if_block_3$1, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*file*/ ctx[11].preview) return 0;
    		if (/*file*/ ctx[11].asset) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = !/*file*/ ctx[11].isDirectory && /*file*/ ctx[11].size !== undefined && create_if_block_1$5(ctx);
    	let if_block2 = /*$fileSettingStore*/ ctx[1].viewOptions && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			if (if_block2) if_block2.c();
    			t8 = space();
    			attr_dev(div0, "class", "file-img-wrapper svelte-1cl0ppd");
    			add_location(div0, file$b, 69, 12, 2795);
    			attr_dev(span, "class", "m-auto");
    			add_location(span, file$b, 83, 16, 3325);
    			attr_dev(div1, "class", "file-title scroll svelte-1cl0ppd");
    			attr_dev(div1, "title", div1_title_value = /*file*/ ctx[11].name);
    			add_location(div1, file$b, 82, 12, 3258);
    			attr_dev(div2, "class", "file-data svelte-1cl0ppd");
    			add_location(div2, file$b, 90, 12, 3626);
    			attr_dev(div3, "class", "file-data svelte-1cl0ppd");
    			add_location(div3, file$b, 91, 12, 3702);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			if_blocks[current_block_type_index].m(div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span);
    			append_dev(span, t1);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, t6);
    			insert_dev(target, t7, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t8, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if ((!current || dirty & /*orderFiles, list*/ 12) && t1_value !== (t1_value = limitString(/*file*/ ctx[11].name, /*list*/ ctx[3] ? 60 : 30, "...") + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*orderFiles*/ 4 && div1_title_value !== (div1_title_value = /*file*/ ctx[11].name)) {
    				attr_dev(div1, "title", div1_title_value);
    			}

    			if (!/*file*/ ctx[11].isDirectory && /*file*/ ctx[11].size !== undefined) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if ((!current || dirty & /*orderFiles*/ 4) && t4_value !== (t4_value = setDateFormatStr(/*file*/ ctx[11].creation) + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*orderFiles*/ 4) && t6_value !== (t6_value = setDateFormatStr(/*file*/ ctx[11].modification) + "")) set_data_dev(t6, t6_value);

    			if (/*$fileSettingStore*/ ctx[1].viewOptions) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$fileSettingStore*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$a(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t8.parentNode, t8);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t7);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(65:8) <FileGridItem              file={{ ...file, index, idxFocus: parentIndex + index }}              {viewItem}              {list}          >",
    		ctx
    	});

    	return block;
    }

    // (64:4) {#each orderFiles as file, index}
    function create_each_block$3(ctx) {
    	let filegriditem;
    	let current;

    	filegriditem = new FileGridItem({
    			props: {
    				file: {
    					.../*file*/ ctx[11],
    					index: /*index*/ ctx[13],
    					idxFocus: /*parentIndex*/ ctx[0] + /*index*/ ctx[13]
    				},
    				viewItem: /*viewItem*/ ctx[5],
    				list: /*list*/ ctx[3],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(filegriditem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filegriditem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filegriditem_changes = {};

    			if (dirty & /*orderFiles, parentIndex*/ 5) filegriditem_changes.file = {
    				.../*file*/ ctx[11],
    				index: /*index*/ ctx[13],
    				idxFocus: /*parentIndex*/ ctx[0] + /*index*/ ctx[13]
    			};

    			if (dirty & /*list*/ 8) filegriditem_changes.list = /*list*/ ctx[3];

    			if (dirty & /*$$scope, orderFiles, list, $fileSettingStore*/ 16398) {
    				filegriditem_changes.$$scope = { dirty, ctx };
    			}

    			filegriditem.$set(filegriditem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filegriditem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filegriditem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filegriditem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(64:4) {#each orderFiles as file, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let each_value = /*orderFiles*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*list*/ ctx[3]
    			? ""
    			: `gap-${/*$fileGridCssStore*/ ctx[4].gap}`) + " svelte-1cl0ppd"));

    			toggle_class(div, "file-list", /*list*/ ctx[3]);
    			toggle_class(div, "file-grid", !/*list*/ ctx[3]);
    			add_location(div, file$b, 58, 0, 2474);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*orderFiles, parentIndex, viewItem, list, $fileSettingStore, setDateFormatStr, getSizeMb, undefined, limitString*/ 47) {
    				each_value = /*orderFiles*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*list, $fileGridCssStore*/ 24 && div_class_value !== (div_class_value = "" + (null_to_empty(/*list*/ ctx[3]
    			? ""
    			: `gap-${/*$fileGridCssStore*/ ctx[4].gap}`) + " svelte-1cl0ppd"))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*list, $fileGridCssStore, list*/ 24) {
    				toggle_class(div, "file-list", /*list*/ ctx[3]);
    			}

    			if (dirty & /*list, $fileGridCssStore, list*/ 24) {
    				toggle_class(div, "file-grid", !/*list*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let orderFiles;
    	let list;
    	let $filePreviewStore;
    	let $fileSettingStore;
    	let $fileGridCssStore;
    	validate_store(filePreviewStore$1, 'filePreviewStore');
    	component_subscribe($$self, filePreviewStore$1, $$value => $$invalidate(7, $filePreviewStore = $$value));
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(1, $fileSettingStore = $$value));
    	validate_store(fileGridCssStore, 'fileGridCssStore');
    	component_subscribe($$self, fileGridCssStore, $$value => $$invalidate(4, $fileGridCssStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileGrid', slots, []);
    	let { files = [] } = $$props;
    	let { parentIndex = 0 } = $$props;
    	const key = getContext("id");

    	const sortBy = {
    		name: (f1, f2) => f1.name > f2.name ? 1 : -1,
    		size: (f1, f2) => f1.size > f2.size ? 1 : -1,
    		type: (f1, f2) => getFileType(f1) > getFileType(f2) ? 1 : -1,
    		creation: (f1, f2) => new Date(f1.creation) > new Date(f2.creation) ? 1 : -1,
    		modification: (f1, f2) => new Date(f1.modification) > new Date(f2.modification)
    		? 1
    		: -1
    	};

    	function sortFiles(fileA, fileB, type = "name", orderAsc = true) {
    		let factor = orderAsc ? 1 : -1;

    		if (fileA.isDirectory && !fileB.isDirectory) {
    			return -1;
    		} else if (fileB.isDirectory && !fileA.isDirectory) {
    			return 1;
    		}

    		return sortBy[type](fileA, fileB) * factor;
    	}

    	function viewItem(file) {
    		let consecutives = { prev: null, next: null };

    		for (let key of ["prev", "next"]) {
    			let factor = key === "prev" ? -1 : 1;
    			let counter = file.index;

    			while ((key === "prev"
    			? counter > 0
    			: counter < orderFiles.length - 1) && !consecutives[key]) {
    				counter += 1 * factor;

    				if (FileBrowser$1.visor.includes(orderFiles[counter].type)) {
    					consecutives[key] = () => {
    						viewItem(Object.assign(Object.assign({}, orderFiles[counter]), { index: counter }));
    					};
    				}
    			}
    		}

    		let filePreview = Object.assign(Object.assign({}, file), consecutives);
    		filePreviewStore$1.setPreview(key, filePreview);
    	}

    	const writable_props = ['files', 'parentIndex'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileGrid> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('files' in $$props) $$invalidate(6, files = $$props.files);
    		if ('parentIndex' in $$props) $$invalidate(0, parentIndex = $$props.parentIndex);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		filePreviewStore: filePreviewStore$1,
    		fileSettingStore,
    		fileGridCssStore,
    		FileGridItem,
    		FileGridItemPreview,
    		FileGridItemBar,
    		FileBrowser: FileBrowser$1,
    		getFileType,
    		getSizeMb,
    		limitString,
    		setDateFormatStr,
    		files,
    		parentIndex,
    		key,
    		sortBy,
    		sortFiles,
    		viewItem,
    		orderFiles,
    		list,
    		$filePreviewStore,
    		$fileSettingStore,
    		$fileGridCssStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(6, files = $$props.files);
    		if ('parentIndex' in $$props) $$invalidate(0, parentIndex = $$props.parentIndex);
    		if ('orderFiles' in $$props) $$invalidate(2, orderFiles = $$props.orderFiles);
    		if ('list' in $$props) $$invalidate(3, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*files, $fileSettingStore*/ 66) {
    			$$invalidate(2, orderFiles = files.sort((a, b) => sortFiles(a, b, $fileSettingStore.sortBy, $fileSettingStore.orderAsc)));
    		}

    		if ($$self.$$.dirty & /*$fileSettingStore, $filePreviewStore*/ 130) {
    			$$invalidate(3, list = $fileSettingStore.viewList && $filePreviewStore.get(key) === undefined);
    		}
    	};

    	return [
    		parentIndex,
    		$fileSettingStore,
    		orderFiles,
    		list,
    		$fileGridCssStore,
    		viewItem,
    		files,
    		$filePreviewStore
    	];
    }

    class FileGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { files: 6, parentIndex: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileGrid",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get files() {
    		throw new Error("<FileGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<FileGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parentIndex() {
    		throw new Error("<FileGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parentIndex(value) {
    		throw new Error("<FileGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\visors\FileVisorImage.svelte generated by Svelte v3.44.2 */
    const file$a = "src\\components\\fileBrowser\\visors\\FileVisorImage.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (55:16) {#each porcentageOption as option, i}
    function create_each_block$2(ctx) {
    	let option;

    	let t0_value = (/*option*/ ctx[19] === 0
    	? "Auto"
    	: /*option*/ ctx[19] * 100 + "%") + "";

    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*i*/ ctx[21];
    			option.value = option.__value;
    			add_location(option, file$a, 55, 20, 1857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(55:16) {#each porcentageOption as option, i}",
    		ctx
    	});

    	return block;
    }

    // (67:4) {#if loading}
    function create_if_block$9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "loader m-t-10");
    			add_location(div, file$a, 67, 8, 2280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(67:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let select_1;
    	let t0;
    	let div1;
    	let actionbutton0;
    	let t1;
    	let actionbutton1;
    	let t2;
    	let t3;
    	let img;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*porcentageOption*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	actionbutton0 = new ActionButton({
    			props: { icon: "fas fa-undo" },
    			$$inline: true
    		});

    	actionbutton0.$on("click", /*click_handler*/ ctx[11]);

    	actionbutton1 = new ActionButton({
    			props: { icon: "fas fa-redo" },
    			$$inline: true
    		});

    	actionbutton1.$on("click", /*click_handler_1*/ ctx[12]);
    	let if_block = /*loading*/ ctx[4] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			select_1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t1 = space();
    			create_component(actionbutton1.$$.fragment);
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			img = element("img");
    			add_location(select_1, file$a, 53, 12, 1722);
    			add_location(div0, file$a, 52, 8, 1703);
    			attr_dev(div1, "class", "d-flex");
    			add_location(div1, file$a, 61, 8, 2050);
    			attr_dev(div2, "class", "file-visor-control svelte-33bgyq");
    			add_location(div2, file$a, 51, 4, 1661);
    			attr_dev(img, "alt", "preview");
    			attr_dev(img, "class", "m-auto svelte-33bgyq");
    			toggle_class(img, "loading", /*loading*/ ctx[4]);
    			toggle_class(img, "glass-in", /*porcentageIndex*/ ctx[2] === 0);
    			toggle_class(img, "glass-out", /*porcentageIndex*/ ctx[2] !== 0);
    			add_location(img, file$a, 69, 4, 2326);
    			attr_dev(div3, "class", "scroll d-flex p-relative");
    			add_location(div3, file$a, 50, 0, 1587);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, select_1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select_1, null);
    			}

    			/*select_1_binding*/ ctx[10](select_1);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(actionbutton0, div1, null);
    			append_dev(div1, t1);
    			mount_component(actionbutton1, div1, null);
    			append_dev(div3, t2);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, img);
    			/*img_binding*/ ctx[14](img);
    			/*div3_binding*/ ctx[15](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select_1, "change", /*handleZoomOnSelect*/ ctx[7], false, false, false),
    					listen_dev(img, "load", /*load_handler*/ ctx[13], false, false, false),
    					listen_dev(img, "click", /*handleZoomOnClick*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*porcentageOption*/ 32) {
    				each_value = /*porcentageOption*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select_1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*loading*/ ctx[4]) {
    				if (if_block) ; else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(div3, t3);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*loading*/ 16) {
    				toggle_class(img, "loading", /*loading*/ ctx[4]);
    			}

    			if (dirty & /*porcentageIndex*/ 4) {
    				toggle_class(img, "glass-in", /*porcentageIndex*/ ctx[2] === 0);
    			}

    			if (dirty & /*porcentageIndex*/ 4) {
    				toggle_class(img, "glass-out", /*porcentageIndex*/ ctx[2] !== 0);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);
    			transition_in(actionbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			transition_out(actionbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			/*select_1_binding*/ ctx[10](null);
    			destroy_component(actionbutton0);
    			destroy_component(actionbutton1);
    			if (if_block) if_block.d();
    			/*img_binding*/ ctx[14](null);
    			/*div3_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileVisorImage', slots, []);
    	let { preview } = $$props;
    	let imageVisorWrapper;
    	let imageVisor;
    	let degre = 0;
    	let porcentageOption = [0, 1, 0.75, 0.5, 0.33, 0.25];
    	let porcentageIndex = 0;
    	let select;
    	let loading = false;

    	function initImage() {
    		$$invalidate(1, imageVisor.style.maxHeight = "100%", imageVisor);
    		$$invalidate(1, imageVisor.style.maxWidth = "100%", imageVisor);
    		imageVisor.removeAttribute("width");
    		$$invalidate(2, porcentageIndex = 0);
    	}

    	function zoom() {
    		$$invalidate(1, imageVisor.style.maxHeight = null, imageVisor);
    		$$invalidate(1, imageVisor.style.maxWidth = null, imageVisor);

    		if (porcentageIndex >= porcentageOption.length || porcentageIndex === 0) {
    			initImage();
    		} else {
    			$$invalidate(
    				1,
    				imageVisor.width = (imageVisor === null || imageVisor === void 0
    				? void 0
    				: imageVisor.naturalWidth) * porcentageOption[porcentageIndex],
    				imageVisor
    			);
    		}

    		$$invalidate(3, select.value = porcentageIndex.toString(), select);
    	}

    	function handleZoomOnClick() {
    		$$invalidate(2, porcentageIndex++, porcentageIndex);
    		zoom();
    	}

    	function handleZoomOnSelect() {
    		$$invalidate(2, porcentageIndex = parseInt(select.value));
    		zoom();
    	}

    	function rotate(g = 90) {
    		degre += g;
    		degre = Math.abs(degre) === 360 ? 0 : degre;
    		$$invalidate(1, imageVisor.style.transform = `rotate(${degre}deg)`, imageVisor);
    	}

    	onMount(initImage);
    	const writable_props = ['preview'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileVisorImage> was created with unknown prop '${key}'`);
    	});

    	function select_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			select = $$value;
    			$$invalidate(3, select);
    		});
    	}

    	const click_handler = () => rotate(-90);
    	const click_handler_1 = () => rotate();

    	const load_handler = () => {
    		$$invalidate(4, loading = false);

    		if (porcentageIndex > 0) {
    			$$invalidate(1, imageVisor.width = imageVisor?.naturalWidth * porcentageOption[porcentageIndex], imageVisor);
    		}
    	};

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			imageVisor = $$value;
    			(($$invalidate(1, imageVisor), $$invalidate(9, preview)), $$invalidate(0, imageVisorWrapper));
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			imageVisorWrapper = $$value;
    			$$invalidate(0, imageVisorWrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('preview' in $$props) $$invalidate(9, preview = $$props.preview);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		ActionButton,
    		preview,
    		imageVisorWrapper,
    		imageVisor,
    		degre,
    		porcentageOption,
    		porcentageIndex,
    		select,
    		loading,
    		initImage,
    		zoom,
    		handleZoomOnClick,
    		handleZoomOnSelect,
    		rotate
    	});

    	$$self.$inject_state = $$props => {
    		if ('preview' in $$props) $$invalidate(9, preview = $$props.preview);
    		if ('imageVisorWrapper' in $$props) $$invalidate(0, imageVisorWrapper = $$props.imageVisorWrapper);
    		if ('imageVisor' in $$props) $$invalidate(1, imageVisor = $$props.imageVisor);
    		if ('degre' in $$props) degre = $$props.degre;
    		if ('porcentageOption' in $$props) $$invalidate(5, porcentageOption = $$props.porcentageOption);
    		if ('porcentageIndex' in $$props) $$invalidate(2, porcentageIndex = $$props.porcentageIndex);
    		if ('select' in $$props) $$invalidate(3, select = $$props.select);
    		if ('loading' in $$props) $$invalidate(4, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*preview, imageVisor, imageVisorWrapper*/ 515) {
    			if (preview.src && imageVisor && preview.src !== (imageVisor === null || imageVisor === void 0
    			? void 0
    			: imageVisor.src)) {
    				$$invalidate(4, loading = true);
    				$$invalidate(1, imageVisor.src = preview.src, imageVisor);

    				imageVisorWrapper === null || imageVisorWrapper === void 0
    				? void 0
    				: imageVisorWrapper.scrollTo(0, 0);
    			}
    		}
    	};

    	return [
    		imageVisorWrapper,
    		imageVisor,
    		porcentageIndex,
    		select,
    		loading,
    		porcentageOption,
    		handleZoomOnClick,
    		handleZoomOnSelect,
    		rotate,
    		preview,
    		select_1_binding,
    		click_handler,
    		click_handler_1,
    		load_handler,
    		img_binding,
    		div3_binding
    	];
    }

    class FileVisorImage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { preview: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileVisorImage",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*preview*/ ctx[9] === undefined && !('preview' in props)) {
    			console.warn("<FileVisorImage> was created without expected prop 'preview'");
    		}
    	}

    	get preview() {
    		throw new Error("<FileVisorImage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preview(value) {
    		throw new Error("<FileVisorImage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\visors\FileVisorText.svelte generated by Svelte v3.44.2 */
    const file_1$1 = "src\\components\\fileBrowser\\visors\\FileVisorText.svelte";

    // (68:4) {:else}
    function create_else_block$4(ctx) {
    	let textarea;
    	let textarea_disabled_value;
    	let t;
    	let if_block_anchor;
    	let if_block = /*enableEdit*/ ctx[0] && !/*loading*/ ctx[3] && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(textarea, "class", "txt-edit-file scroll svelte-wjm53u");
    			textarea.disabled = textarea_disabled_value = !/*enableEdit*/ ctx[0];
    			toggle_class(textarea, "enableEdit", /*enableEdit*/ ctx[0]);
    			add_location(textarea, file_1$1, 68, 8, 1768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			/*textarea_binding*/ ctx[7](textarea);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*enableEdit*/ 1 && textarea_disabled_value !== (textarea_disabled_value = !/*enableEdit*/ ctx[0])) {
    				prop_dev(textarea, "disabled", textarea_disabled_value);
    			}

    			if (dirty & /*enableEdit*/ 1) {
    				toggle_class(textarea, "enableEdit", /*enableEdit*/ ctx[0]);
    			}

    			if (/*enableEdit*/ ctx[0] && !/*loading*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			/*textarea_binding*/ ctx[7](null);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(68:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (66:4) {#if errMessage}
    function create_if_block$8(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "errMessage";
    			add_location(h2, file_1$1, 66, 8, 1726);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(66:4) {#if errMessage}",
    		ctx
    	});

    	return block;
    }

    // (75:8) {#if enableEdit && !loading}
    function create_if_block_1$4(ctx) {
    	let div;
    	let button0;
    	let i0;
    	let t0;
    	let t1;
    	let button1;
    	let i1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t0 = text("\r\n                    Guardar");
    			t1 = space();
    			button1 = element("button");
    			i1 = element("i");
    			t2 = text("\r\n                    Cancelar");
    			attr_dev(i0, "class", "fas fa-save");
    			add_location(i0, file_1$1, 77, 20, 2105);
    			attr_dev(button0, "class", "btn m-auto w-25");
    			add_location(button0, file_1$1, 76, 16, 2031);
    			attr_dev(i1, "class", "far fa-window-close");
    			add_location(i1, file_1$1, 81, 20, 2284);
    			attr_dev(button1, "class", "btn m-auto w-25");
    			add_location(button1, file_1$1, 80, 16, 2204);
    			attr_dev(div, "class", "txt-edit-control svelte-wjm53u");
    			add_location(div, file_1$1, 75, 12, 1983);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, i0);
    			append_dev(button0, t0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(button1, i1);
    			append_dev(button1, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*editFile*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*dialogOnCancel*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(75:8) {#if enableEdit && !loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*errMessage*/ ctx[2]) return create_if_block$8;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "txt-edit svelte-wjm53u");
    			add_location(div, file_1$1, 64, 0, 1672);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileVisorText', slots, []);
    	let { file } = $$props;
    	let { enableEdit = false } = $$props;
    	let textArea;
    	let originalData = "";
    	let errMessage = "";
    	let loading = false;

    	function loadData() {
    		dialogStore$1.showLoading();
    		$$invalidate(3, loading = true);

    		FileService.getAsTxt(
    			file,
    			dataString => {
    				dialogStore$1.reset();
    				$$invalidate(3, loading = false);
    				$$invalidate(1, textArea.value = dataString, textArea);
    				originalData = dataString;
    			},
    			err => {
    				dialogStore$1.reset();
    				$$invalidate(3, loading = false);
    				$$invalidate(2, errMessage = err.message);
    			}
    		);
    	}

    	function dialogOnCancel() {
    		if (textArea.value !== originalData) {
    			dialogStore$1.showDialog("¿Esta seguro de descartar los cambios?", () => {
    				$$invalidate(0, enableEdit = false);
    				$$invalidate(1, textArea.value = originalData, textArea);
    				dialogStore$1.reset();
    			});
    		} else {
    			$$invalidate(0, enableEdit = false);
    		}
    	}

    	function editFile() {
    		if (textArea.value !== originalData) {
    			let fileEdit = {
    				name: file.name,
    				route: file.route,
    				text: textArea.value
    			};

    			dialogStore$1.showLoading();

    			FileService.editTxt(
    				fileEdit,
    				() => {
    					dialogStore$1.reset();
    					originalData = textArea.value;
    					$$invalidate(0, enableEdit = false);
    				},
    				err => {
    					dialogStore$1.showMessage(err.message);
    				}
    			);
    		} else {
    			$$invalidate(0, enableEdit = false);
    		}
    	}

    	const writable_props = ['file', 'enableEdit'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileVisorText> was created with unknown prop '${key}'`);
    	});

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textArea = $$value;
    			$$invalidate(1, textArea);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(6, file = $$props.file);
    		if ('enableEdit' in $$props) $$invalidate(0, enableEdit = $$props.enableEdit);
    	};

    	$$self.$capture_state = () => ({
    		FileService,
    		dialogStore: dialogStore$1,
    		file,
    		enableEdit,
    		textArea,
    		originalData,
    		errMessage,
    		loading,
    		loadData,
    		dialogOnCancel,
    		editFile
    	});

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(6, file = $$props.file);
    		if ('enableEdit' in $$props) $$invalidate(0, enableEdit = $$props.enableEdit);
    		if ('textArea' in $$props) $$invalidate(1, textArea = $$props.textArea);
    		if ('originalData' in $$props) originalData = $$props.originalData;
    		if ('errMessage' in $$props) $$invalidate(2, errMessage = $$props.errMessage);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*file*/ 64) {
    			if (file) {
    				loadData();
    			}
    		}

    		if ($$self.$$.dirty & /*enableEdit, textArea*/ 3) {
    			if (enableEdit && textArea) {
    				setTimeout(
    					() => {
    						textArea.focus();
    					},
    					300
    				);
    			}
    		}
    	};

    	return [
    		enableEdit,
    		textArea,
    		errMessage,
    		loading,
    		dialogOnCancel,
    		editFile,
    		file,
    		textarea_binding
    	];
    }

    class FileVisorText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { file: 6, enableEdit: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileVisorText",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[6] === undefined && !('file' in props)) {
    			console.warn("<FileVisorText> was created without expected prop 'file'");
    		}
    	}

    	get file() {
    		throw new Error("<FileVisorText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<FileVisorText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enableEdit() {
    		throw new Error("<FileVisorText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enableEdit(value) {
    		throw new Error("<FileVisorText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\visors\FileVisor.svelte generated by Svelte v3.44.2 */

    const { Object: Object_1$1 } = globals;
    const file$9 = "src\\components\\fileBrowser\\visors\\FileVisor.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (70:12) {#each ["prev", "next"] as element}
    function create_each_block$1(ctx) {
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				disabled: !/*preview*/ ctx[2][/*element*/ ctx[15]],
    				title: /*element*/ ctx[15],
    				icon: `fas fa-${/*element*/ ctx[15] === "prev"
				? "arrow-left"
				: "arrow-right"}`
    			},
    			$$inline: true
    		});

    	actionbutton.$on("click", function () {
    		if (is_function(/*preview*/ ctx[2][/*element*/ ctx[15]])) /*preview*/ ctx[2][/*element*/ ctx[15]].apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const actionbutton_changes = {};
    			if (dirty & /*preview*/ 4) actionbutton_changes.disabled = !/*preview*/ ctx[2][/*element*/ ctx[15]];
    			actionbutton.$set(actionbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(70:12) {#each [\\\"prev\\\", \\\"next\\\"] as element}",
    		ctx
    	});

    	return block;
    }

    // (80:12) {#if !enableEdit && FileBrowser.editables.includes(preview.type)}
    function create_if_block_2$3(ctx) {
    	let actionbutton;
    	let current;

    	actionbutton = new ActionButton({
    			props: {
    				title: "Edit element",
    				icon: "fas fa-edit"
    			},
    			$$inline: true
    		});

    	actionbutton.$on("click", /*click_handler_1*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(actionbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actionbutton, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actionbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(80:12) {#if !enableEdit && FileBrowser.editables.includes(preview.type)}",
    		ctx
    	});

    	return block;
    }

    // (109:4) {:else}
    function create_else_block$3(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "title", "file");
    			if (!src_url_equal(iframe.src, iframe_src_value = FileService.preview(/*preview*/ ctx[2]))) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "class", "file-iframe scroll svelte-j97hut");
    			add_location(iframe, file$9, 109, 8, 3830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*preview*/ 4 && !src_url_equal(iframe.src, iframe_src_value = FileService.preview(/*preview*/ ctx[2]))) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(109:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (107:79) 
    function create_if_block_1$3(ctx) {
    	let filevisortext;
    	let updating_enableEdit;
    	let current;

    	function filevisortext_enableEdit_binding(value) {
    		/*filevisortext_enableEdit_binding*/ ctx[13](value);
    	}

    	let filevisortext_props = { file: /*preview*/ ctx[2] };

    	if (/*enableEdit*/ ctx[1] !== void 0) {
    		filevisortext_props.enableEdit = /*enableEdit*/ ctx[1];
    	}

    	filevisortext = new FileVisorText({
    			props: filevisortext_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(filevisortext, 'enableEdit', filevisortext_enableEdit_binding));

    	const block = {
    		c: function create() {
    			create_component(filevisortext.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filevisortext, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filevisortext_changes = {};
    			if (dirty & /*preview*/ 4) filevisortext_changes.file = /*preview*/ ctx[2];

    			if (!updating_enableEdit && dirty & /*enableEdit*/ 2) {
    				updating_enableEdit = true;
    				filevisortext_changes.enableEdit = /*enableEdit*/ ctx[1];
    				add_flush_callback(() => updating_enableEdit = false);
    			}

    			filevisortext.$set(filevisortext_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filevisortext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filevisortext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filevisortext, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(107:79) ",
    		ctx
    	});

    	return block;
    }

    // (105:4) {#if FileBrowser.previews.image.includes(preview.type)}
    function create_if_block$7(ctx) {
    	let filevisorimage;
    	let current;

    	filevisorimage = new FileVisorImage({
    			props: { preview: /*preview*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(filevisorimage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filevisorimage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filevisorimage_changes = {};
    			if (dirty & /*preview*/ 4) filevisorimage_changes.preview = /*preview*/ ctx[2];
    			filevisorimage.$set(filevisorimage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filevisorimage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filevisorimage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filevisorimage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(105:4) {#if FileBrowser.previews.image.includes(preview.type)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let actionbutton0;
    	let t0;
    	let t1;
    	let show_if_2 = !/*enableEdit*/ ctx[1] && FileBrowser$1.editables.includes(/*preview*/ ctx[2].type);
    	let t2;
    	let actionbutton1;
    	let t3;
    	let h3;
    	let t4_value = /*preview*/ ctx[2].name + "";
    	let t4;
    	let t5;
    	let div1;
    	let actionbutton2;
    	let t6;
    	let show_if;
    	let show_if_1;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let mounted;
    	let dispose;

    	actionbutton0 = new ActionButton({
    			props: {
    				className: "expand",
    				title: /*expanded*/ ctx[0] ? "Contraer" : "Expandir",
    				icon: `fas fa-${/*expanded*/ ctx[0] ? "compress-alt" : "expand-alt"}`
    			},
    			$$inline: true
    		});

    	actionbutton0.$on("click", /*click_handler*/ ctx[11]);
    	let each_value = ["prev", "next"];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 2; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block0 = show_if_2 && create_if_block_2$3(ctx);

    	actionbutton1 = new ActionButton({
    			props: {
    				className: isBookmark(/*$fileBrowserStore*/ ctx[3].bookmarks, /*preview*/ ctx[2])
    				? "btn-active"
    				: "",
    				title: "Marcador",
    				icon: "far fa-star"
    			},
    			$$inline: true
    		});

    	actionbutton1.$on("click", /*updateBookmark*/ ctx[6]);

    	actionbutton2 = new ActionButton({
    			props: {
    				style: "background-color: #d42; color: white",
    				icon: "fas fa-times"
    			},
    			$$inline: true
    		});

    	actionbutton2.$on("click", /*closePreview*/ ctx[7]);
    	const if_block_creators = [create_if_block$7, create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty & /*preview*/ 4) show_if = !!FileBrowser$1.previews.image.includes(/*preview*/ ctx[2].type);
    		if (show_if) return 0;
    		if (show_if_1 == null || dirty & /*preview, enableEdit*/ 6) show_if_1 = !!(FileBrowser$1.previews.asText.includes(/*preview*/ ctx[2].type) || /*enableEdit*/ ctx[1]);
    		if (show_if_1) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(actionbutton0.$$.fragment);
    			t0 = space();

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			create_component(actionbutton1.$$.fragment);
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			create_component(actionbutton2.$$.fragment);
    			t6 = space();
    			if_block1.c();
    			attr_dev(div0, "class", "d-flex");
    			add_location(div0, file$9, 62, 8, 1975);
    			attr_dev(h3, "class", "file-visor-title svelte-j97hut");
    			add_location(h3, file$9, 95, 8, 3278);
    			attr_dev(div1, "class", "m-l-auto");
    			add_location(div1, file$9, 96, 8, 3336);
    			attr_dev(div2, "class", "d-flex");
    			add_location(div2, file$9, 61, 4, 1945);
    			attr_dev(div3, "class", "file-visor statusToolbar svelte-j97hut");
    			toggle_class(div3, "toolbarExpanded", !/*$fileToolbarCollapsedStore*/ ctx[4]);
    			add_location(div3, file$9, 56, 0, 1786);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(actionbutton0, div0, null);
    			append_dev(div0, t0);

    			for (let i = 0; i < 2; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t1);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t2);
    			mount_component(actionbutton1, div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, h3);
    			append_dev(h3, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			mount_component(actionbutton2, div1, null);
    			append_dev(div3, t6);
    			if_blocks[current_block_type_index].m(div3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*validateKey*/ ctx[5], false, false, false),
    					listen_dev(div3, "contextmenu", stop_propagation(prevent_default(/*contextmenu_handler*/ ctx[10])), false, true, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const actionbutton0_changes = {};
    			if (dirty & /*expanded*/ 1) actionbutton0_changes.title = /*expanded*/ ctx[0] ? "Contraer" : "Expandir";
    			if (dirty & /*expanded*/ 1) actionbutton0_changes.icon = `fas fa-${/*expanded*/ ctx[0] ? "compress-alt" : "expand-alt"}`;
    			actionbutton0.$set(actionbutton0_changes);

    			if (dirty & /*preview*/ 4) {
    				each_value = ["prev", "next"];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 2; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, t1);
    					}
    				}

    				group_outros();

    				for (i = 2; i < 2; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*enableEdit, preview*/ 6) show_if_2 = !/*enableEdit*/ ctx[1] && FileBrowser$1.editables.includes(/*preview*/ ctx[2].type);

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*enableEdit, preview*/ 6) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const actionbutton1_changes = {};

    			if (dirty & /*$fileBrowserStore, preview*/ 12) actionbutton1_changes.className = isBookmark(/*$fileBrowserStore*/ ctx[3].bookmarks, /*preview*/ ctx[2])
    			? "btn-active"
    			: "";

    			actionbutton1.$set(actionbutton1_changes);
    			if ((!current || dirty & /*preview*/ 4) && t4_value !== (t4_value = /*preview*/ ctx[2].name + "")) set_data_dev(t4, t4_value);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div3, null);
    			}

    			if (dirty & /*$fileToolbarCollapsedStore*/ 16) {
    				toggle_class(div3, "toolbarExpanded", !/*$fileToolbarCollapsedStore*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actionbutton0.$$.fragment, local);

    			for (let i = 0; i < 2; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block0);
    			transition_in(actionbutton1.$$.fragment, local);
    			transition_in(actionbutton2.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actionbutton0.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < 2; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block0);
    			transition_out(actionbutton1.$$.fragment, local);
    			transition_out(actionbutton2.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(actionbutton0);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			destroy_component(actionbutton1);
    			destroy_component(actionbutton2);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let preview;
    	let $fileBrowserStore;
    	let $filePreviewStore;
    	let $fileToolbarCollapsedStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(3, $fileBrowserStore = $$value));
    	validate_store(filePreviewStore$1, 'filePreviewStore');
    	component_subscribe($$self, filePreviewStore$1, $$value => $$invalidate(9, $filePreviewStore = $$value));
    	validate_store(fileToolbarCollapsedStore, 'fileToolbarCollapsedStore');
    	component_subscribe($$self, fileToolbarCollapsedStore, $$value => $$invalidate(4, $fileToolbarCollapsedStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileVisor', slots, []);
    	let { expanded } = $$props;
    	let { active } = $$props;
    	const key = getContext("id");
    	let enableEdit = false;

    	function validateKey(e) {
    		if (active && !enableEdit) {
    			if (e.key === "ArrowRight" && preview.next) {
    				return preview.next();
    			}

    			if (e.key === "ArrowLeft" && preview.prev) {
    				return preview.prev();
    			}

    			if (e.key === "Escape") {
    				filePreviewStore$1.removePreview(key);
    				scrollStore.triggerPrevious();
    				return;
    			}
    		}
    	}

    	function updateBookmark() {
    		let p = Object.assign({}, preview);
    		fileBrowserStore.updateBookmarks(p);

    		if ($fileBrowserStore.viewBookmarks) {
    			if (p.next) {
    				p.next();
    			} else if (p.prev) {
    				p.prev();
    			} else {
    				closePreview();
    			}
    		}
    	}

    	function closePreview() {
    		filePreviewStore$1.removePreview(key);
    		scrollStore.triggerPrevious();
    	}

    	const writable_props = ['expanded', 'active'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileVisor> was created with unknown prop '${key}'`);
    	});

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = () => $$invalidate(0, expanded = !expanded);
    	const click_handler_1 = () => $$invalidate(1, enableEdit = true);

    	function filevisortext_enableEdit_binding(value) {
    		enableEdit = value;
    		$$invalidate(1, enableEdit);
    	}

    	$$self.$$set = $$props => {
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
    		if ('active' in $$props) $$invalidate(8, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		fileBrowserStore,
    		filePreviewStore: filePreviewStore$1,
    		scrollStore,
    		fileToolbarCollapsedStore,
    		FileVisorImage,
    		ActionButton,
    		FileVisorText,
    		FileService,
    		isBookmark,
    		FileBrowser: FileBrowser$1,
    		expanded,
    		active,
    		key,
    		enableEdit,
    		validateKey,
    		updateBookmark,
    		closePreview,
    		preview,
    		$fileBrowserStore,
    		$filePreviewStore,
    		$fileToolbarCollapsedStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
    		if ('active' in $$props) $$invalidate(8, active = $$props.active);
    		if ('enableEdit' in $$props) $$invalidate(1, enableEdit = $$props.enableEdit);
    		if ('preview' in $$props) $$invalidate(2, preview = $$props.preview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$filePreviewStore*/ 512) {
    			$$invalidate(2, preview = $filePreviewStore.get(key));
    		}
    	};

    	return [
    		expanded,
    		enableEdit,
    		preview,
    		$fileBrowserStore,
    		$fileToolbarCollapsedStore,
    		validateKey,
    		updateBookmark,
    		closePreview,
    		active,
    		$filePreviewStore,
    		contextmenu_handler,
    		click_handler,
    		click_handler_1,
    		filevisortext_enableEdit_binding
    	];
    }

    class FileVisor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { expanded: 0, active: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileVisor",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*expanded*/ ctx[0] === undefined && !('expanded' in props)) {
    			console.warn("<FileVisor> was created without expected prop 'expanded'");
    		}

    		if (/*active*/ ctx[8] === undefined && !('active' in props)) {
    			console.warn("<FileVisor> was created without expected prop 'active'");
    		}
    	}

    	get expanded() {
    		throw new Error("<FileVisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<FileVisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<FileVisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<FileVisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\views\FileViewEmpty.svelte generated by Svelte v3.44.2 */
    const file$8 = "src\\components\\fileBrowser\\views\\FileViewEmpty.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let i;
    	let t0;
    	let p;

    	let t1_value = (/*$fileBrowserStore*/ ctx[0].filter
    	? `No se encontraron elementos con el filtro ${/*$fileBrowserStore*/ ctx[0].filter}`
    	: "Sin elementos por el momento") + "";

    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "far fa-folder-open m-auto svelte-15rpxv0");
    			add_location(i, file$8, 5, 4, 126);
    			add_location(p, file$8, 6, 4, 171);
    			attr_dev(div, "class", "browser-empty svelte-15rpxv0");
    			add_location(div, file$8, 4, 0, 93);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$fileBrowserStore*/ 1 && t1_value !== (t1_value = (/*$fileBrowserStore*/ ctx[0].filter
    			? `No se encontraron elementos con el filtro ${/*$fileBrowserStore*/ ctx[0].filter}`
    			: "Sin elementos por el momento") + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $fileBrowserStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(0, $fileBrowserStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileViewEmpty', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileViewEmpty> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fileBrowserStore, $fileBrowserStore });
    	return [$fileBrowserStore];
    }

    class FileViewEmpty extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileViewEmpty",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\fileBrowser\views\FileView.svelte generated by Svelte v3.44.2 */
    const file$7 = "src\\components\\fileBrowser\\views\\FileView.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (104:4) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let show_if = /*$filePreviewStore*/ ctx[6].get(/*key*/ ctx[8]);
    	let if_block1_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*$fileSettingStore*/ ctx[3].groupBy) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = show_if && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div, "class", "scroll browser-wrapper svelte-95min0");
    			toggle_class(div, "active", /*$filePreviewStore*/ ctx[6].get(/*key*/ ctx[8]));
    			toggle_class(div, "statusToolbar", /*$filePreviewStore*/ ctx[6].get(/*key*/ ctx[8]));
    			toggle_class(div, "toolbarExpanded", !/*$fileToolbarCollapsedStore*/ ctx[7]);
    			toggle_class(div, "expanded", /*expanded*/ ctx[4]);
    			add_location(div, file$7, 104, 8, 3292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[13](div);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, null);
    			}

    			if (dirty & /*$filePreviewStore, key*/ 320) {
    				toggle_class(div, "active", /*$filePreviewStore*/ ctx[6].get(/*key*/ ctx[8]));
    			}

    			if (dirty & /*$filePreviewStore, key*/ 320) {
    				toggle_class(div, "statusToolbar", /*$filePreviewStore*/ ctx[6].get(/*key*/ ctx[8]));
    			}

    			if (dirty & /*$fileToolbarCollapsedStore*/ 128) {
    				toggle_class(div, "toolbarExpanded", !/*$fileToolbarCollapsedStore*/ ctx[7]);
    			}

    			if (dirty & /*expanded*/ 16) {
    				toggle_class(div, "expanded", /*expanded*/ ctx[4]);
    			}

    			if (dirty & /*$filePreviewStore*/ 64) show_if = /*$filePreviewStore*/ ctx[6].get(/*key*/ ctx[8]);

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$filePreviewStore*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[13](null);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(104:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (102:4) {#if filteredFiles.length === 0}
    function create_if_block$6(ctx) {
    	let fileviewempty;
    	let current;
    	fileviewempty = new FileViewEmpty({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fileviewempty.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileviewempty, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileviewempty.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileviewempty.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileviewempty, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(102:4) {#if filteredFiles.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (115:12) {:else}
    function create_else_block_1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*filesGroup*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filesGroup, calculatePreviousLength*/ 544) {
    				each_value = /*filesGroup*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(115:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:12) {#if !$fileSettingStore.groupBy}
    function create_if_block_2$2(ctx) {
    	let filegrid;
    	let current;

    	filegrid = new FileGrid({
    			props: { files: /*filteredFiles*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(filegrid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filegrid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filegrid_changes = {};
    			if (dirty & /*filteredFiles*/ 4) filegrid_changes.files = /*filteredFiles*/ ctx[2];
    			filegrid.$set(filegrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filegrid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(113:12) {#if !$fileSettingStore.groupBy}",
    		ctx
    	});

    	return block;
    }

    // (117:20) <Accordion title={fileGroup.group} id={fileGroup.group}>
    function create_default_slot$2(ctx) {
    	let filegrid;
    	let t;
    	let current;

    	filegrid = new FileGrid({
    			props: {
    				files: /*fileGroup*/ ctx[18].files,
    				parentIndex: /*calculatePreviousLength*/ ctx[9](/*index*/ ctx[20])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(filegrid.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(filegrid, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filegrid_changes = {};
    			if (dirty & /*filesGroup*/ 32) filegrid_changes.files = /*fileGroup*/ ctx[18].files;
    			filegrid.$set(filegrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filegrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filegrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filegrid, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(117:20) <Accordion title={fileGroup.group} id={fileGroup.group}>",
    		ctx
    	});

    	return block;
    }

    // (116:16) {#each filesGroup as fileGroup, index}
    function create_each_block(ctx) {
    	let accordion;
    	let current;

    	accordion = new Accordion({
    			props: {
    				title: /*fileGroup*/ ctx[18].group,
    				id: /*fileGroup*/ ctx[18].group,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(accordion.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accordion, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordion_changes = {};
    			if (dirty & /*filesGroup*/ 32) accordion_changes.title = /*fileGroup*/ ctx[18].group;
    			if (dirty & /*filesGroup*/ 32) accordion_changes.id = /*fileGroup*/ ctx[18].group;

    			if (dirty & /*$$scope, filesGroup*/ 2097184) {
    				accordion_changes.$$scope = { dirty, ctx };
    			}

    			accordion.$set(accordion_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordion.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordion.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accordion, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(116:16) {#each filesGroup as fileGroup, index}",
    		ctx
    	});

    	return block;
    }

    // (126:8) {#if $filePreviewStore.get(key)}
    function create_if_block_1$2(ctx) {
    	let div;
    	let filevisor;
    	let updating_expanded;
    	let current;

    	function filevisor_expanded_binding(value) {
    		/*filevisor_expanded_binding*/ ctx[14](value);
    	}

    	let filevisor_props = { active: /*active*/ ctx[0] };

    	if (/*expanded*/ ctx[4] !== void 0) {
    		filevisor_props.expanded = /*expanded*/ ctx[4];
    	}

    	filevisor = new FileVisor({ props: filevisor_props, $$inline: true });
    	binding_callbacks.push(() => bind(filevisor, 'expanded', filevisor_expanded_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(filevisor.$$.fragment);
    			attr_dev(div, "class", "browser-preview svelte-95min0");
    			toggle_class(div, "expanded", /*expanded*/ ctx[4]);
    			add_location(div, file$7, 126, 12, 4184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(filevisor, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const filevisor_changes = {};
    			if (dirty & /*active*/ 1) filevisor_changes.active = /*active*/ ctx[0];

    			if (!updating_expanded && dirty & /*expanded*/ 16) {
    				updating_expanded = true;
    				filevisor_changes.expanded = /*expanded*/ ctx[4];
    				add_flush_callback(() => updating_expanded = false);
    			}

    			filevisor.$set(filevisor_changes);

    			if (dirty & /*expanded*/ 16) {
    				toggle_class(div, "expanded", /*expanded*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filevisor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filevisor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(filevisor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(126:8) {#if $filePreviewStore.get(key)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*filteredFiles*/ ctx[2].length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "browser-container t-left scroll svelte-95min0");
    			add_location(div, file$7, 100, 0, 3159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "resize", fileGridCssStore.updateGridInfo, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let filteredFiles;
    	let filesGroup;
    	let $filePreviewStore;
    	let $fileBrowserStore;
    	let $scrollStore;
    	let $fileSettingStore;
    	let $fileToolbarCollapsedStore;
    	validate_store(filePreviewStore$1, 'filePreviewStore');
    	component_subscribe($$self, filePreviewStore$1, $$value => $$invalidate(6, $filePreviewStore = $$value));
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(11, $fileBrowserStore = $$value));
    	validate_store(scrollStore, 'scrollStore');
    	component_subscribe($$self, scrollStore, $$value => $$invalidate(12, $scrollStore = $$value));
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(3, $fileSettingStore = $$value));
    	validate_store(fileToolbarCollapsedStore, 'fileToolbarCollapsedStore');
    	component_subscribe($$self, fileToolbarCollapsedStore, $$value => $$invalidate(7, $fileToolbarCollapsedStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileView', slots, []);
    	let { files = [] } = $$props;
    	let { active = true } = $$props;
    	const key = new Date().toISOString();
    	const itemsFiltered = getContext("itemsFiltered");
    	let grid;
    	let expanded = false;

    	function getFileGroup(file, group) {
    		switch (group) {
    			case "type":
    				return getFileType(file);
    			case "creation":
    			case "modification":
    				return groupByDateClasification(new Date(file[group]));
    			default:
    				return "";
    		}
    	}

    	function groupFiles(files = [], group) {
    		let groupedFiles = [];
    		let fileMap = {};

    		files.forEach(file => {
    			let fileGroup = getFileGroup(file, group);

    			if (!fileMap[fileGroup]) {
    				fileMap[fileGroup] = [];
    			}

    			fileMap[fileGroup].push(file);
    		});

    		for (let key in fileMap) {
    			groupedFiles.push({ group: key, files: fileMap[key] });
    		}

    		groupedFiles.sort((a, b) => {
    			try {
    				if (group === "type") {
    					return a.group > b.group ? 1 : -1;
    				}

    				let f1 = a.files[0][group];
    				let f2 = b.files[0][group];
    				return new Date(f1) > new Date(f2) ? -1 : 1;
    			} catch(e) {
    				return 0;
    			}
    		});

    		return groupedFiles;
    	}

    	function calculatePreviousLength(index) {
    		let size = 0;

    		for (let i = 0; i < index; i++) {
    			size += filesGroup[i].files.length;
    		}

    		return size;
    	}

    	setContext("id", key);

    	onMount(() => {
    		return () => {
    			if ($filePreviewStore.get(key)) {
    				filePreviewStore$1.removePreview(key);
    			}
    		};
    	});

    	const writable_props = ['files', 'active'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileView> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			grid = $$value;
    			$$invalidate(1, grid);
    		});
    	}

    	function filevisor_expanded_binding(value) {
    		expanded = value;
    		$$invalidate(4, expanded);
    	}

    	$$self.$$set = $$props => {
    		if ('files' in $$props) $$invalidate(10, files = $$props.files);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		setContext,
    		fileBrowserStore,
    		filePreviewStore: filePreviewStore$1,
    		fileSettingStore,
    		fileGridCssStore,
    		scrollStore,
    		fileToolbarCollapsedStore,
    		FileGrid,
    		FileVisor,
    		FileViewEmpty,
    		Accordion,
    		getFileType,
    		groupByDateClasification,
    		files,
    		active,
    		key,
    		itemsFiltered,
    		grid,
    		expanded,
    		getFileGroup,
    		groupFiles,
    		calculatePreviousLength,
    		filteredFiles,
    		filesGroup,
    		$filePreviewStore,
    		$fileBrowserStore,
    		$scrollStore,
    		$fileSettingStore,
    		$fileToolbarCollapsedStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(10, files = $$props.files);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('grid' in $$props) $$invalidate(1, grid = $$props.grid);
    		if ('expanded' in $$props) $$invalidate(4, expanded = $$props.expanded);
    		if ('filteredFiles' in $$props) $$invalidate(2, filteredFiles = $$props.filteredFiles);
    		if ('filesGroup' in $$props) $$invalidate(5, filesGroup = $$props.filesGroup);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*files, $fileBrowserStore*/ 3072) {
    			$$invalidate(2, filteredFiles = files.filter(f => {
    				if ($fileBrowserStore.filter) {
    					let filtered = f.name.toLowerCase().includes($fileBrowserStore.filter.toLowerCase());
    					return filtered;
    				}

    				return true;
    			}));
    		}

    		if ($$self.$$.dirty & /*$fileSettingStore, filteredFiles*/ 12) {
    			$$invalidate(5, filesGroup = $fileSettingStore.groupBy
    			? groupFiles(filteredFiles, $fileSettingStore.groupBy)
    			: []);
    		}

    		if ($$self.$$.dirty & /*$scrollStore, grid*/ 4098) {
    			if ($scrollStore.previewY > 0 && grid) {
    				grid.scroll({
    					top: $scrollStore.previewY,
    					behavior: "smooth"
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$fileBrowserStore, filteredFiles*/ 2052) {
    			if ($fileBrowserStore.filter) {
    				itemsFiltered(filteredFiles.length);
    			}
    		}
    	};

    	return [
    		active,
    		grid,
    		filteredFiles,
    		$fileSettingStore,
    		expanded,
    		filesGroup,
    		$filePreviewStore,
    		$fileToolbarCollapsedStore,
    		key,
    		calculatePreviousLength,
    		files,
    		$fileBrowserStore,
    		$scrollStore,
    		div_binding,
    		filevisor_expanded_binding
    	];
    }

    class FileView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { files: 10, active: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileView",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get files() {
    		throw new Error("<FileView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<FileView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<FileView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<FileView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\FileInit.svelte generated by Svelte v3.44.2 */

    const file$6 = "src\\components\\fileBrowser\\FileInit.svelte";

    // (25:0) {#if $fileBrowserStore.viewBookmarks}
    function create_if_block$5(ctx) {
    	let fileview;
    	let current;

    	fileview = new FileView({
    			props: {
    				files: /*$fileBrowserStore*/ ctx[0].bookmarks
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fileview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fileview_changes = {};
    			if (dirty & /*$fileBrowserStore*/ 1) fileview_changes.files = /*$fileBrowserStore*/ ctx[0].bookmarks;
    			fileview.$set(fileview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(25:0) {#if $fileBrowserStore.viewBookmarks}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let fileview;
    	let t;
    	let if_block_anchor;
    	let current;

    	fileview = new FileView({
    			props: {
    				files: /*$fileBrowserStore*/ ctx[0].files,
    				active: !/*$fileBrowserStore*/ ctx[0].viewBookmarks
    			},
    			$$inline: true
    		});

    	let if_block = /*$fileBrowserStore*/ ctx[0].viewBookmarks && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(fileview.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			toggle_class(div, "inactive", /*$fileBrowserStore*/ ctx[0].viewBookmarks);
    			add_location(div, file$6, 18, 0, 673);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(fileview, div, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fileview_changes = {};
    			if (dirty & /*$fileBrowserStore*/ 1) fileview_changes.files = /*$fileBrowserStore*/ ctx[0].files;
    			if (dirty & /*$fileBrowserStore*/ 1) fileview_changes.active = !/*$fileBrowserStore*/ ctx[0].viewBookmarks;
    			fileview.$set(fileview_changes);

    			if (dirty & /*$fileBrowserStore*/ 1) {
    				toggle_class(div, "inactive", /*$fileBrowserStore*/ ctx[0].viewBookmarks);
    			}

    			if (/*$fileBrowserStore*/ ctx[0].viewBookmarks) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$fileBrowserStore*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileview.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileview.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(fileview);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $fileDirectoryStore;
    	let $fileBrowserStore;
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(2, $fileDirectoryStore = $$value));
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(0, $fileBrowserStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileInit', slots, []);
    	let { files = [] } = $$props;

    	onMount(() => {
    		fileBrowserStore.setFiles(files, $fileDirectoryStore.current);
    		fileSettingStore.updateCache($fileDirectoryStore.current);
    		document.title = "FileBrowser - " + getLastTreeName($fileDirectoryStore.current);
    	});

    	const writable_props = ['files'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileInit> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fileBrowserStore,
    		fileDirectoryStore,
    		fileSettingStore,
    		FileView,
    		getLastTreeName,
    		files,
    		$fileDirectoryStore,
    		$fileBrowserStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(1, files = $$props.files);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$fileBrowserStore, files];
    }

    class FileInit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { files: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileInit",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get files() {
    		throw new Error("<FileInit>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set files(value) {
    		throw new Error("<FileInit>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\views\FileViewError.svelte generated by Svelte v3.44.2 */
    const file$5 = "src\\components\\fileBrowser\\views\\FileViewError.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let h1;
    	let i;
    	let t0;
    	let h2;
    	let t1_value = /*error*/ ctx[0].message + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			i = element("i");
    			t0 = space();
    			h2 = element("h2");
    			t1 = text(t1_value);
    			attr_dev(i, "class", "fas fa-exclamation-triangle");
    			add_location(i, file$5, 13, 27, 365);
    			attr_dev(h1, "class", "alert-icon svelte-o5eyji");
    			add_location(h1, file$5, 13, 4, 342);
    			add_location(h2, file$5, 14, 4, 417);
    			attr_dev(div, "class", "alert-danger svelte-o5eyji");
    			add_location(div, file$5, 12, 0, 310);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, i);
    			append_dev(div, t0);
    			append_dev(div, h2);
    			append_dev(h2, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*error*/ 1 && t1_value !== (t1_value = /*error*/ ctx[0].message + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileViewError', slots, []);
    	let { error } = $$props;
    	let { navigate } = $$props;

    	onMount(() => {
    		if (error.status === 401 && navigate) {
    			navigate("/login");
    		}

    		fileBrowserStore.setError();
    	});

    	const writable_props = ['error', 'navigate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileViewError> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    		if ('navigate' in $$props) $$invalidate(1, navigate = $$props.navigate);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fileBrowserStore,
    		error,
    		navigate
    	});

    	$$self.$inject_state = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    		if ('navigate' in $$props) $$invalidate(1, navigate = $$props.navigate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [error, navigate];
    }

    class FileViewError extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { error: 0, navigate: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileViewError",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*error*/ ctx[0] === undefined && !('error' in props)) {
    			console.warn("<FileViewError> was created without expected prop 'error'");
    		}

    		if (/*navigate*/ ctx[1] === undefined && !('navigate' in props)) {
    			console.warn("<FileViewError> was created without expected prop 'navigate'");
    		}
    	}

    	get error() {
    		throw new Error("<FileViewError>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<FileViewError>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get navigate() {
    		throw new Error("<FileViewError>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<FileViewError>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\fileBrowser\views\FileViewWaiting.svelte generated by Svelte v3.44.2 */
    const file$4 = "src\\components\\fileBrowser\\views\\FileViewWaiting.svelte";

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "loader svelte-6e50rf");
    			add_location(div0, file$4, 10, 4, 340);
    			attr_dev(div1, "class", "loader svelte-6e50rf");
    			add_location(div1, file$4, 11, 4, 368);
    			attr_dev(div2, "class", "loader svelte-6e50rf");
    			add_location(div2, file$4, 12, 4, 396);
    			attr_dev(div3, "class", "d-flex m-auto loader-container w-50 svelte-6e50rf");
    			add_location(div3, file$4, 9, 0, 285);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileViewWaiting', slots, []);

    	onMount(() => {
    		fileBrowserStore.setWaiting(true);
    		document.title = "FileBrowser";
    		return () => fileBrowserStore.setWaiting(false);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileViewWaiting> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, fileBrowserStore });
    	return [];
    }

    class FileViewWaiting extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileViewWaiting",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\fileBrowser\forms\FileInfo.svelte generated by Svelte v3.44.2 */

    const { Object: Object_1 } = globals;
    const file_1 = "src\\components\\fileBrowser\\forms\\FileInfo.svelte";

    // (101:4) {:else}
    function create_else_block$1(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let span;
    	let t2_value = /*file*/ ctx[0].name + "";
    	let t2;
    	let t3;
    	let if_block = !/*$fileBrowserStore*/ ctx[5].viewBookmarks && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Nombre";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(label, "for", "type");
    			add_location(label, file_1, 102, 12, 3519);
    			attr_dev(span, "class", "inp-type disable p-3 w-100 f-08 t-left");
    			add_location(span, file_1, 104, 16, 3607);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file_1, 103, 12, 3565);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file_1, 101, 8, 3473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div0, t3);
    			if (if_block) if_block.m(div0, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*file*/ 1 && t2_value !== (t2_value = /*file*/ ctx[0].name + "")) set_data_dev(t2, t2_value);

    			if (!/*$fileBrowserStore*/ ctx[5].viewBookmarks) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(101:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:4) {#if editName}
    function create_if_block_5(ctx) {
    	let inputtext;
    	let updating_value;
    	let updating_errors;
    	let current;

    	function inputtext_value_binding(value) {
    		/*inputtext_value_binding*/ ctx[8](value);
    	}

    	function inputtext_errors_binding(value) {
    		/*inputtext_errors_binding*/ ctx[9](value);
    	}

    	let inputtext_props = {
    		name: "name",
    		label: "Nombre",
    		regex: FileBrowser$1.regexp.folderName
    	};

    	if (/*values*/ ctx[2].name !== void 0) {
    		inputtext_props.value = /*values*/ ctx[2].name;
    	}

    	if (/*errors*/ ctx[3].name !== void 0) {
    		inputtext_props.errors = /*errors*/ ctx[3].name;
    	}

    	inputtext = new InputText({ props: inputtext_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputtext, 'value', inputtext_value_binding));
    	binding_callbacks.push(() => bind(inputtext, 'errors', inputtext_errors_binding));

    	const block = {
    		c: function create() {
    			create_component(inputtext.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputtext, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputtext_changes = {};

    			if (!updating_value && dirty & /*values*/ 4) {
    				updating_value = true;
    				inputtext_changes.value = /*values*/ ctx[2].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_errors && dirty & /*errors*/ 8) {
    				updating_errors = true;
    				inputtext_changes.errors = /*errors*/ ctx[3].name;
    				add_flush_callback(() => updating_errors = false);
    			}

    			inputtext.$set(inputtext_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputtext, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(93:4) {#if editName}",
    		ctx
    	});

    	return block;
    }

    // (108:16) {#if !$fileBrowserStore.viewBookmarks}
    function create_if_block_6(ctx) {
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-edit");
    			add_location(i, file_1, 112, 24, 3990);
    			attr_dev(button, "class", "inp-type disable pointer");
    			add_location(button, file_1, 108, 20, 3796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[10]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(108:16) {#if !$fileBrowserStore.viewBookmarks}",
    		ctx
    	});

    	return block;
    }

    // (120:4) {#if file.size !== undefined}
    function create_if_block_4(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let span;
    	let t2_value = getSizeMb(/*file*/ ctx[0].size) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Tamaño";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(label, "for", "type");
    			add_location(label, file_1, 121, 12, 4209);
    			attr_dev(span, "class", "inp-type disable p-3 w-100 f-08 t-left");
    			add_location(span, file_1, 123, 16, 4297);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file_1, 122, 12, 4255);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file_1, 120, 8, 4163);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*file*/ 1 && t2_value !== (t2_value = getSizeMb(/*file*/ ctx[0].size) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(120:4) {#if file.size !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#if file.creation}
    function create_if_block_3(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let span;
    	let t2_value = setDateFormatStr(/*file*/ ctx[0].creation, "dd/mm/yyyy HH24:MI") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Creación";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(label, "for", "type");
    			add_location(label, file_1, 132, 12, 4549);
    			attr_dev(span, "class", "inp-type disable p-3 w-100 f-08 t-left");
    			add_location(span, file_1, 134, 16, 4639);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file_1, 133, 12, 4597);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file_1, 131, 8, 4503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*file*/ 1 && t2_value !== (t2_value = setDateFormatStr(/*file*/ ctx[0].creation, "dd/mm/yyyy HH24:MI") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(131:4) {#if file.creation}",
    		ctx
    	});

    	return block;
    }

    // (142:4) {#if file.modification}
    function create_if_block_2$1(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let span;
    	let t2_value = setDateFormatStr(/*file*/ ctx[0].modification, "dd/mm/yyyy HH24:MI") + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Ultima Modificación";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(t2_value);
    			attr_dev(label, "for", "type");
    			add_location(label, file_1, 143, 12, 4928);
    			attr_dev(span, "class", "inp-type disable p-3 w-100 f-08 t-left");
    			add_location(span, file_1, 145, 16, 5029);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file_1, 144, 12, 4987);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file_1, 142, 8, 4882);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*file*/ 1 && t2_value !== (t2_value = setDateFormatStr(/*file*/ ctx[0].modification, "dd/mm/yyyy HH24:MI") + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(142:4) {#if file.modification}",
    		ctx
    	});

    	return block;
    }

    // (152:4) {#if finalError}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("* ");
    			t1 = text(/*finalError*/ ctx[4]);
    			attr_dev(div, "class", "f-08");
    			set_style(div, "color", "red");
    			add_location(div, file_1, 152, 8, 5267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*finalError*/ 16) set_data_dev(t1, /*finalError*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(152:4) {#if finalError}",
    		ctx
    	});

    	return block;
    }

    // (157:4) {#if editName}
    function create_if_block$4(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Modificar";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Cancelar";
    			attr_dev(button0, "type", "submit");
    			attr_dev(button0, "class", "btn m-auto w-25");
    			add_location(button0, file_1, 158, 12, 5442);
    			attr_dev(button1, "class", "btn m-auto w-25");
    			add_location(button1, file_1, 159, 12, 5520);
    			attr_dev(div, "class", "form-field-control d-flex");
    			add_location(div, file_1, 157, 8, 5389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", prevent_default(/*click_handler_1*/ ctx[11]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(157:4) {#if editName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let form;
    	let div1;
    	let label;
    	let t1;
    	let div0;
    	let span;
    	let t2_value = /*file*/ ctx[0].route + "";
    	let t2;
    	let span_class_value;
    	let t3;
    	let current_block_type_index;
    	let if_block0;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_5, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*editName*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*file*/ ctx[0].size !== undefined && create_if_block_4(ctx);
    	let if_block2 = /*file*/ ctx[0].creation && create_if_block_3(ctx);
    	let if_block3 = /*file*/ ctx[0].modification && create_if_block_2$1(ctx);
    	let if_block4 = /*finalError*/ ctx[4] && create_if_block_1$1(ctx);
    	let if_block5 = /*editName*/ ctx[1] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "Ruta";
    			t1 = space();
    			div0 = element("div");
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			if (if_block3) if_block3.c();
    			t7 = space();
    			if (if_block4) if_block4.c();
    			t8 = space();
    			if (if_block5) if_block5.c();
    			attr_dev(label, "for", "type");
    			add_location(label, file_1, 80, 8, 2833);

    			attr_dev(span, "class", span_class_value = `inp-type disable p-3 w-100 f-08 t-left ${/*$fileBrowserStore*/ ctx[5].viewBookmarks
			? " pointer underline"
			: ""}`);

    			add_location(span, file_1, 82, 12, 2911);
    			attr_dev(div0, "class", "form-field");
    			add_location(div0, file_1, 81, 8, 2873);
    			attr_dev(div1, "class", "form-field-control");
    			add_location(div1, file_1, 79, 4, 2791);
    			add_location(form, file_1, 78, 0, 2739);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div1);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(form, t3);
    			if_blocks[current_block_type_index].m(form, null);
    			append_dev(form, t4);
    			if (if_block1) if_block1.m(form, null);
    			append_dev(form, t5);
    			if (if_block2) if_block2.m(form, null);
    			append_dev(form, t6);
    			if (if_block3) if_block3.m(form, null);
    			append_dev(form, t7);
    			if (if_block4) if_block4.m(form, null);
    			append_dev(form, t8);
    			if (if_block5) if_block5.m(form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span, "click", /*goToRoute*/ ctx[7], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[6]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*file*/ 1) && t2_value !== (t2_value = /*file*/ ctx[0].route + "")) set_data_dev(t2, t2_value);

    			if (!current || dirty & /*$fileBrowserStore*/ 32 && span_class_value !== (span_class_value = `inp-type disable p-3 w-100 f-08 t-left ${/*$fileBrowserStore*/ ctx[5].viewBookmarks
			? " pointer underline"
			: ""}`)) {
    				attr_dev(span, "class", span_class_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(form, t4);
    			}

    			if (/*file*/ ctx[0].size !== undefined) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(form, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*file*/ ctx[0].creation) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					if_block2.m(form, t6);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*file*/ ctx[0].modification) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$1(ctx);
    					if_block3.c();
    					if_block3.m(form, t7);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*finalError*/ ctx[4]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_1$1(ctx);
    					if_block4.c();
    					if_block4.m(form, t8);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*editName*/ ctx[1]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block$4(ctx);
    					if_block5.c();
    					if_block5.m(form, null);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $fileBrowserStore;
    	validate_store(fileBrowserStore, 'fileBrowserStore');
    	component_subscribe($$self, fileBrowserStore, $$value => $$invalidate(5, $fileBrowserStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileInfo', slots, []);
    	let { file } = $$props;
    	const closeModal = getContext("closeModal");
    	const blockModal = getContext("blockModal");
    	let editName = false;
    	let values = { name: file.name };
    	let errors = { name: "" };
    	let finalError = "";

    	function handleSubmit() {
    		var _a, _b;
    		let updatedFile = Object.assign(Object.assign({}, file), { newName: values.name });

    		const cb = () => {
    			fileBrowserStore.setFileNameUpdate(updatedFile);
    			blockModal(false);
    			closeModal();
    		};

    		const err = err => {
    			blockModal(false);
    			$$invalidate(4, finalError = err.message);

    			setTimeout(
    				() => {
    					$$invalidate(4, finalError = "");
    				},
    				10000
    			);
    		};

    		if (((_a = values === null || values === void 0
    		? void 0
    		: values.name) === null || _a === void 0
    		? void 0
    		: _a.trim().length) === 0) {
    			$$invalidate(3, errors.name = `* El campo es obligatorio`, errors);
    			return;
    		}

    		if (((_b = values === null || values === void 0
    		? void 0
    		: values.name) === null || _b === void 0
    		? void 0
    		: _b.trim()) === file.name) {
    			$$invalidate(3, errors.name = `* El campo no ha sido actualizado`, errors);
    			return;
    		}

    		if ($fileBrowserStore.files.find(f => f.name === values.name.trim())) {
    			$$invalidate(3, errors.name = `* El nombre del archivo ya existe en la ruta`, errors);
    			return;
    		}

    		blockModal(true);
    		FileService.edit(updatedFile, cb, err);
    	}

    	function goToRoute() {
    		if ($fileBrowserStore.viewBookmarks) {
    			fileBrowserStore.setViewBookmarks();
    			fileDirectoryStore.setDirectory(file.route, file.name);
    			closeModal();
    		}
    	}

    	onMount(() => {
    		if (file.isDirectory) {
    			blockModal(true);

    			FileService.information(
    				file,
    				resp => {
    					if (resp.data) {
    						$$invalidate(0, file = Object.assign(Object.assign({}, file), resp.data));
    					} else {
    						$$invalidate(4, finalError = "No se puede completar la información de carpeta");
    					}

    					blockModal(false);
    				},
    				data => {
    					$$invalidate(4, finalError = "No se puede completar la información de carpeta: " + data.message);
    					blockModal(false);
    				}
    			);
    		}
    	});

    	const writable_props = ['file'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileInfo> was created with unknown prop '${key}'`);
    	});

    	function inputtext_value_binding(value) {
    		if ($$self.$$.not_equal(values.name, value)) {
    			values.name = value;
    			$$invalidate(2, values);
    		}
    	}

    	function inputtext_errors_binding(value) {
    		if ($$self.$$.not_equal(errors.name, value)) {
    			errors.name = value;
    			$$invalidate(3, errors);
    		}
    	}

    	const click_handler = () => $$invalidate(1, editName = !editName);
    	const click_handler_1 = () => $$invalidate(1, editName = false);

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		fileBrowserStore,
    		fileDirectoryStore,
    		FileService,
    		InputText,
    		getSizeMb,
    		setDateFormatStr,
    		FileBrowser: FileBrowser$1,
    		file,
    		closeModal,
    		blockModal,
    		editName,
    		values,
    		errors,
    		finalError,
    		handleSubmit,
    		goToRoute,
    		$fileBrowserStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('editName' in $$props) $$invalidate(1, editName = $$props.editName);
    		if ('values' in $$props) $$invalidate(2, values = $$props.values);
    		if ('errors' in $$props) $$invalidate(3, errors = $$props.errors);
    		if ('finalError' in $$props) $$invalidate(4, finalError = $$props.finalError);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		file,
    		editName,
    		values,
    		errors,
    		finalError,
    		$fileBrowserStore,
    		handleSubmit,
    		goToRoute,
    		inputtext_value_binding,
    		inputtext_errors_binding,
    		click_handler,
    		click_handler_1
    	];
    }

    class FileInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { file: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileInfo",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console.warn("<FileInfo> was created without expected prop 'file'");
    		}
    	}

    	get file() {
    		throw new Error("<FileInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<FileInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FileBrowser.svelte generated by Svelte v3.44.2 */

    const file$3 = "src\\components\\FileBrowser.svelte";

    // (44:8) {:catch error}
    function create_catch_block(ctx) {
    	let fileviewerror;
    	let current;

    	fileviewerror = new FileViewError({
    			props: {
    				error: /*error*/ ctx[8],
    				navigate: /*navigate*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fileviewerror.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileviewerror, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fileviewerror_changes = {};
    			if (dirty & /*fileList*/ 8) fileviewerror_changes.error = /*error*/ ctx[8];
    			if (dirty & /*navigate*/ 1) fileviewerror_changes.navigate = /*navigate*/ ctx[0];
    			fileviewerror.$set(fileviewerror_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileviewerror.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileviewerror.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileviewerror, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(44:8) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {:then list}
    function create_then_block(ctx) {
    	let fileinit;
    	let current;

    	fileinit = new FileInit({
    			props: { files: /*list*/ ctx[7].files },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fileinit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileinit, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fileinit_changes = {};
    			if (dirty & /*fileList*/ 8) fileinit_changes.files = /*list*/ ctx[7].files;
    			fileinit.$set(fileinit_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileinit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileinit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileinit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(42:8) {:then list}",
    		ctx
    	});

    	return block;
    }

    // (40:25)               <FileViewWaiting />          {:then list}
    function create_pending_block(ctx) {
    	let fileviewwaiting;
    	let current;
    	fileviewwaiting = new FileViewWaiting({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fileviewwaiting.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileviewwaiting, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileviewwaiting.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileviewwaiting.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileviewwaiting, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(40:25)               <FileViewWaiting />          {:then list}",
    		ctx
    	});

    	return block;
    }

    // (39:4) <FileLayout>
    function create_default_slot_1(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 7,
    		error: 8,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*fileList*/ ctx[3], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*fileList*/ 8 && promise !== (promise = /*fileList*/ ctx[3]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(39:4) <FileLayout>",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if fileInfo}
    function create_if_block$3(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				icon: "fas fa-info",
    				label: "Detalle elemento",
    				onClose: /*func*/ ctx[5],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_changes = {};
    			if (dirty & /*fileInfo*/ 4) modal_changes.onClose = /*func*/ ctx[5];

    			if (dirty & /*$$scope, fileInfo*/ 516) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(48:4) {#if fileInfo}",
    		ctx
    	});

    	return block;
    }

    // (49:8) <Modal              icon="fas fa-info"              label="Detalle elemento"              onClose={() => (fileInfo = null)}          >
    function create_default_slot$1(ctx) {
    	let fileinfo;
    	let current;

    	fileinfo = new FileInfo({
    			props: { file: /*fileInfo*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fileinfo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fileinfo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fileinfo_changes = {};
    			if (dirty & /*fileInfo*/ 4) fileinfo_changes.file = /*fileInfo*/ ctx[2];
    			fileinfo.$set(fileinfo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fileinfo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fileinfo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fileinfo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(49:8) <Modal              icon=\\\"fas fa-info\\\"              label=\\\"Detalle elemento\\\"              onClose={() => (fileInfo = null)}          >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let filetoolbar;
    	let t0;
    	let filelayout;
    	let t1;
    	let current;

    	filetoolbar = new FileToolBar({
    			props: {
    				numberItemsFiltered: /*numberItemsFiltered*/ ctx[1]
    			},
    			$$inline: true
    		});

    	filelayout = new FileLayout({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*fileInfo*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(filetoolbar.$$.fragment);
    			t0 = space();
    			create_component(filelayout.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(section, "class", "svelte-884lr4");
    			add_location(section, file$3, 36, 0, 1243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(filetoolbar, section, null);
    			append_dev(section, t0);
    			mount_component(filelayout, section, null);
    			append_dev(section, t1);
    			if (if_block) if_block.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const filetoolbar_changes = {};
    			if (dirty & /*numberItemsFiltered*/ 2) filetoolbar_changes.numberItemsFiltered = /*numberItemsFiltered*/ ctx[1];
    			filetoolbar.$set(filetoolbar_changes);
    			const filelayout_changes = {};

    			if (dirty & /*$$scope, fileList, navigate*/ 521) {
    				filelayout_changes.$$scope = { dirty, ctx };
    			}

    			filelayout.$set(filelayout_changes);

    			if (/*fileInfo*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*fileInfo*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filetoolbar.$$.fragment, local);
    			transition_in(filelayout.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filetoolbar.$$.fragment, local);
    			transition_out(filelayout.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(filetoolbar);
    			destroy_component(filelayout);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let fileList;
    	let $fileSettingStore;
    	let $fileDirectoryStore;
    	validate_store(fileSettingStore, 'fileSettingStore');
    	component_subscribe($$self, fileSettingStore, $$value => $$invalidate(6, $fileSettingStore = $$value));
    	validate_store(fileDirectoryStore, 'fileDirectoryStore');
    	component_subscribe($$self, fileDirectoryStore, $$value => $$invalidate(4, $fileDirectoryStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FileBrowser', slots, []);
    	let { navigate } = $$props;
    	let numberItemsFiltered = 0;
    	let fileInfo;

    	setContext("fileInfo", file => {
    		$$invalidate(2, fileInfo = file);
    	});

    	setContext("itemsFiltered", size => {
    		$$invalidate(1, numberItemsFiltered = size);
    	});

    	onMount(() => {
    		if (!$fileDirectoryStore.current) {
    			if ($fileSettingStore.cache[0]) {
    				fileDirectoryStore.setDirectory($fileSettingStore.cache[0]);
    			} else {
    				navigate("/login");
    			}
    		}
    	});

    	const writable_props = ['navigate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FileBrowser> was created with unknown prop '${key}'`);
    	});

    	const func = () => $$invalidate(2, fileInfo = null);

    	$$self.$$set = $$props => {
    		if ('navigate' in $$props) $$invalidate(0, navigate = $$props.navigate);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		setContext,
    		fileDirectoryStore,
    		fileSettingStore,
    		FileToolBar,
    		FileLayout,
    		FileInit,
    		FileViewError,
    		FileViewWaiting,
    		Modal,
    		FileInfo,
    		FileService,
    		navigate,
    		numberItemsFiltered,
    		fileInfo,
    		fileList,
    		$fileSettingStore,
    		$fileDirectoryStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('navigate' in $$props) $$invalidate(0, navigate = $$props.navigate);
    		if ('numberItemsFiltered' in $$props) $$invalidate(1, numberItemsFiltered = $$props.numberItemsFiltered);
    		if ('fileInfo' in $$props) $$invalidate(2, fileInfo = $$props.fileInfo);
    		if ('fileList' in $$props) $$invalidate(3, fileList = $$props.fileList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$fileDirectoryStore*/ 16) {
    			$$invalidate(3, fileList = FileService.list($fileDirectoryStore.current));
    		}
    	};

    	return [navigate, numberItemsFiltered, fileInfo, fileList, $fileDirectoryStore, func];
    }

    class FileBrowser extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { navigate: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FileBrowser",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*navigate*/ ctx[0] === undefined && !('navigate' in props)) {
    			console.warn("<FileBrowser> was created without expected prop 'navigate'");
    		}
    	}

    	get navigate() {
    		throw new Error("<FileBrowser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<FileBrowser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Login.svelte generated by Svelte v3.44.2 */
    const file$2 = "src\\components\\Login.svelte";

    // (42:16) {#if finalError}
    function create_if_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `* ${/*finalError*/ ctx[2]}`;
    			attr_dev(div, "class", "f-08");
    			set_style(div, "color", "red");
    			add_location(div, file$2, 42, 20, 1562);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(42:16) {#if finalError}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let fieldset;
    	let legend;
    	let t1;
    	let div0;
    	let i;
    	let t2;
    	let div2;
    	let form;
    	let inputtext0;
    	let updating_value;
    	let updating_errors;
    	let t3;
    	let inputtext1;
    	let updating_value_1;
    	let updating_errors_1;
    	let t4;
    	let t5;
    	let div1;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	function inputtext0_value_binding(value) {
    		/*inputtext0_value_binding*/ ctx[5](value);
    	}

    	function inputtext0_errors_binding(value) {
    		/*inputtext0_errors_binding*/ ctx[6](value);
    	}

    	let inputtext0_props = { name: "user", label: "Usuario" };

    	if (/*values*/ ctx[0].user !== void 0) {
    		inputtext0_props.value = /*values*/ ctx[0].user;
    	}

    	if (/*errors*/ ctx[1].user !== void 0) {
    		inputtext0_props.errors = /*errors*/ ctx[1].user;
    	}

    	inputtext0 = new InputText({ props: inputtext0_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputtext0, 'value', inputtext0_value_binding));
    	binding_callbacks.push(() => bind(inputtext0, 'errors', inputtext0_errors_binding));

    	function inputtext1_value_binding(value) {
    		/*inputtext1_value_binding*/ ctx[7](value);
    	}

    	function inputtext1_errors_binding(value) {
    		/*inputtext1_errors_binding*/ ctx[8](value);
    	}

    	let inputtext1_props = {
    		name: "key",
    		label: "Password",
    		type: "password"
    	};

    	if (/*values*/ ctx[0].key !== void 0) {
    		inputtext1_props.value = /*values*/ ctx[0].key;
    	}

    	if (/*errors*/ ctx[1].key !== void 0) {
    		inputtext1_props.errors = /*errors*/ ctx[1].key;
    	}

    	inputtext1 = new InputText({ props: inputtext1_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputtext1, 'value', inputtext1_value_binding));
    	binding_callbacks.push(() => bind(inputtext1, 'errors', inputtext1_errors_binding));
    	let if_block = /*finalError*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			fieldset = element("fieldset");
    			legend = element("legend");
    			legend.textContent = "File Browser";
    			t1 = space();
    			div0 = element("div");
    			i = element("i");
    			t2 = space();
    			div2 = element("div");
    			form = element("form");
    			create_component(inputtext0.$$.fragment);
    			t3 = space();
    			create_component(inputtext1.$$.fragment);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Ingresar";
    			attr_dev(legend, "class", "svelte-1hy4e1e");
    			add_location(legend, file$2, 22, 8, 821);
    			attr_dev(i, "class", "fas fa-key login-icon svelte-1hy4e1e");
    			add_location(i, file$2, 24, 12, 901);
    			attr_dev(div0, "class", "login-section svelte-1hy4e1e");
    			add_location(div0, file$2, 23, 8, 860);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "btn m-auto w-50");
    			add_location(button, file$2, 47, 20, 1769);
    			attr_dev(div1, "class", "form-field-control d-flex");
    			add_location(div1, file$2, 46, 16, 1708);
    			add_location(form, file$2, 27, 12, 1003);
    			attr_dev(div2, "class", "login-section svelte-1hy4e1e");
    			add_location(div2, file$2, 26, 8, 962);
    			attr_dev(fieldset, "class", "login-container svelte-1hy4e1e");
    			add_location(fieldset, file$2, 21, 4, 777);
    			attr_dev(div3, "class", "login svelte-1hy4e1e");
    			add_location(div3, file$2, 20, 0, 752);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, fieldset);
    			append_dev(fieldset, legend);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, div0);
    			append_dev(div0, i);
    			append_dev(fieldset, t2);
    			append_dev(fieldset, div2);
    			append_dev(div2, form);
    			mount_component(inputtext0, form, null);
    			append_dev(form, t3);
    			mount_component(inputtext1, form, null);
    			append_dev(form, t4);
    			if (if_block) if_block.m(form, null);
    			append_dev(form, t5);
    			append_dev(form, div1);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const inputtext0_changes = {};

    			if (!updating_value && dirty & /*values*/ 1) {
    				updating_value = true;
    				inputtext0_changes.value = /*values*/ ctx[0].user;
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_errors && dirty & /*errors*/ 2) {
    				updating_errors = true;
    				inputtext0_changes.errors = /*errors*/ ctx[1].user;
    				add_flush_callback(() => updating_errors = false);
    			}

    			inputtext0.$set(inputtext0_changes);
    			const inputtext1_changes = {};

    			if (!updating_value_1 && dirty & /*values*/ 1) {
    				updating_value_1 = true;
    				inputtext1_changes.value = /*values*/ ctx[0].key;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			if (!updating_errors_1 && dirty & /*errors*/ 2) {
    				updating_errors_1 = true;
    				inputtext1_changes.errors = /*errors*/ ctx[1].key;
    				add_flush_callback(() => updating_errors_1 = false);
    			}

    			inputtext1.$set(inputtext1_changes);
    			if (/*finalError*/ ctx[2]) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputtext0.$$.fragment, local);
    			transition_in(inputtext1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputtext0.$$.fragment, local);
    			transition_out(inputtext1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(inputtext0);
    			destroy_component(inputtext1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let { navigate } = $$props;
    	let finalError = "";
    	let values = { user: "", key: "" };
    	let errors = { user: "", key: "" };

    	function handleSubmit() {
    		dialogStore$1.showLoading();

    		FileService.login(
    			values,
    			data => {
    				fileSettingStore.initCache(data.routes);
    				fileDirectoryStore.setInit(data.routes[0]);
    				dialogStore$1.closeDialog();
    				navigate("/");
    			},
    			err => dialogStore$1.showMessage(err.message)
    		);
    	}

    	const writable_props = ['navigate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function inputtext0_value_binding(value) {
    		if ($$self.$$.not_equal(values.user, value)) {
    			values.user = value;
    			$$invalidate(0, values);
    		}
    	}

    	function inputtext0_errors_binding(value) {
    		if ($$self.$$.not_equal(errors.user, value)) {
    			errors.user = value;
    			$$invalidate(1, errors);
    		}
    	}

    	function inputtext1_value_binding(value) {
    		if ($$self.$$.not_equal(values.key, value)) {
    			values.key = value;
    			$$invalidate(0, values);
    		}
    	}

    	function inputtext1_errors_binding(value) {
    		if ($$self.$$.not_equal(errors.key, value)) {
    			errors.key = value;
    			$$invalidate(1, errors);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('navigate' in $$props) $$invalidate(4, navigate = $$props.navigate);
    	};

    	$$self.$capture_state = () => ({
    		FileService,
    		dialogStore: dialogStore$1,
    		fileDirectoryStore,
    		fileSettingStore,
    		InputText,
    		navigate,
    		finalError,
    		values,
    		errors,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('navigate' in $$props) $$invalidate(4, navigate = $$props.navigate);
    		if ('finalError' in $$props) $$invalidate(2, finalError = $$props.finalError);
    		if ('values' in $$props) $$invalidate(0, values = $$props.values);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		values,
    		errors,
    		finalError,
    		handleSubmit,
    		navigate,
    		inputtext0_value_binding,
    		inputtext0_errors_binding,
    		inputtext1_value_binding,
    		inputtext1_errors_binding
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { navigate: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*navigate*/ ctx[4] === undefined && !('navigate' in props)) {
    			console.warn("<Login> was created without expected prop 'navigate'");
    		}
    	}

    	get navigate() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set navigate(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\modal\Dialog.svelte generated by Svelte v3.44.2 */
    const file$1 = "src\\components\\modal\\Dialog.svelte";

    // (23:8) {#if $dialogStore.title}
    function create_if_block_2(ctx) {
    	let div;
    	let t_value = /*$dialogStore*/ ctx[1].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "dialog-title t-center p-5 m-b-5 svelte-1lwo6k6");
    			add_location(div, file$1, 23, 12, 676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$dialogStore*/ 2 && t_value !== (t_value = /*$dialogStore*/ ctx[1].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(23:8) {#if $dialogStore.title}",
    		ctx
    	});

    	return block;
    }

    // (32:8) {:else}
    function create_else_block(ctx) {
    	let div0;
    	let span;
    	let raw_value = /*$dialogStore*/ ctx[1].message + "";
    	let t0;
    	let div1;
    	let button;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*$dialogStore*/ ctx[1].options && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span = element("span");
    			t0 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Aceptar";
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "m-l-5 m-r-5");
    			add_location(span, file$1, 33, 16, 1053);
    			attr_dev(div0, "class", "dialog-body t-center p-5");
    			add_location(div0, file$1, 32, 12, 997);
    			attr_dev(button, "class", "btn m-auto w-25");
    			add_location(button, file$1, 36, 16, 1206);
    			attr_dev(div1, "class", "dialog-footer d-flex m-t-8");
    			add_location(div1, file$1, 35, 12, 1148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span);
    			span.innerHTML = raw_value;
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			/*button_binding*/ ctx[3](button);
    			append_dev(div1, t2);
    			if (if_block) if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$dialogStore*/ 2 && raw_value !== (raw_value = /*$dialogStore*/ ctx[1].message + "")) span.innerHTML = raw_value;
    			if (/*$dialogStore*/ ctx[1].options) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			/*button_binding*/ ctx[3](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(32:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#if $dialogStore.loading}
    function create_if_block$1(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Procesando...";
    			attr_dev(span, "class", "m-l-5 m-r-5");
    			add_location(span, file$1, 29, 16, 900);
    			attr_dev(div, "class", "dialog-body t-center p-5");
    			add_location(div, file$1, 28, 12, 844);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(28:8) {#if $dialogStore.loading}",
    		ctx
    	});

    	return block;
    }

    // (48:16) {#if $dialogStore.options}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Cancelar";
    			attr_dev(button, "class", "btn m-auto w-25");
    			add_location(button, file$1, 48, 20, 1661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(48:16) {#if $dialogStore.options}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$dialogStore*/ ctx[1].title && create_if_block_2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*$dialogStore*/ ctx[1].loading) return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			attr_dev(div0, "class", "dialog svelte-1lwo6k6");
    			add_location(div0, file$1, 21, 4, 608);
    			attr_dev(div1, "class", "modal-wrapper");
    			add_location(div1, file$1, 20, 0, 560);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t);
    			if_block1.m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*validateKey*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$dialogStore*/ ctx[1].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div0, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, {}, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, {}, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $dialogStore;
    	validate_store(dialogStore$1, 'dialogStore');
    	component_subscribe($$self, dialogStore$1, $$value => $$invalidate(1, $dialogStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, []);
    	let accept;

    	function validateKey(e) {
    		if (e.key === "Escape") {
    			dialogStore$1.closeDialog();
    		}
    	}

    	onMount(() => {
    		setTimeout(
    			() => {
    				accept === null || accept === void 0
    				? void 0
    				: accept.focus();
    			},
    			250
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			accept = $$value;
    			$$invalidate(0, accept);
    		});
    	}

    	const click_handler = () => {
    		$dialogStore.options
    		? $dialogStore.onAction()
    		: dialogStore$1.closeDialog();
    	};

    	const click_handler_1 = () => {
    		$dialogStore.onHide();
    		dialogStore$1.closeDialog();
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fly,
    		dialogStore: dialogStore$1,
    		accept,
    		validateKey,
    		$dialogStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('accept' in $$props) $$invalidate(0, accept = $$props.accept);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$dialogStore, accept*/ 3) {
    			if (!$dialogStore.options) {
    				accept === null || accept === void 0
    				? void 0
    				: accept.focus();
    			}
    		}
    	};

    	return [
    		accept,
    		$dialogStore,
    		validateKey,
    		button_binding,
    		click_handler,
    		click_handler_1
    	];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.2 */
    const file = "src\\App.svelte";

    // (12:2) {#if $dialogStore.active}
    function create_if_block(ctx) {
    	let dialog;
    	let current;
    	dialog = new Dialog({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(12:2) {#if $dialogStore.active}",
    		ctx
    	});

    	return block;
    }

    // (8:0) <Router>
    function create_default_slot(ctx) {
    	let main;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let current;

    	route0 = new Route$1({
    			props: { path: "/", component: FileBrowser },
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: { path: "/login", component: Login },
    			$$inline: true
    		});

    	let if_block = /*$dialogStore*/ ctx[0].active && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			add_location(main, file, 8, 1, 303);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(route0, main, null);
    			append_dev(main, t0);
    			mount_component(route1, main, null);
    			append_dev(main, t1);
    			if (if_block) if_block.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$dialogStore*/ ctx[0].active) {
    				if (if_block) {
    					if (dirty & /*$dialogStore*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(route0);
    			destroy_component(route1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, $dialogStore*/ 3) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $dialogStore;
    	validate_store(dialogStore$1, 'dialogStore');
    	component_subscribe($$self, dialogStore$1, $$value => $$invalidate(0, $dialogStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		FileBrowser,
    		Login,
    		Dialog,
    		dialogStore: dialogStore$1,
    		$dialogStore
    	});

    	return [$dialogStore];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
