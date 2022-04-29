const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

const VERSION = process.env.REACT_APP_VERSION;

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

const loggedMessages: string[] = [];
const log = (message: string, ...args: any[]) => {
  switch (args.length) {
    case 0: {
      loggedMessages.push(`[dev] ${message}`);
      break;
    }
    case 1: {
      loggedMessages.push(`[dev] ${message}: ${JSON.stringify(args.at(0))}`);
      break;
    }
    default: {
      loggedMessages.push(`[dev] ${message}: ${JSON.stringify(args)}`);
      break;
    }
  }

  const e = document.querySelector<HTMLPreElement>('#devlog');
  if (e) {
    e.innerText = loggedMessages.join('\n');
  }
};

log('log works', { version: VERSION, isLocalhost });

export function register(config?: Config) {
  if (process.env.NODE_ENV === 'production') {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      log(
        "Our service worker won't work if PUBLIC_URL is on a different origin from what our page is served on. This might happen if a CDN is used to serve assets; see https://github.com/facebook/create-react-app/issues/2374",
      );
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          log('This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA');
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl, { scope: '/memlog/' })
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              log('New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA.');

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      log('Error during service worker registration', { error });
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      log('No internet connection found. App is running in offline mode.');
    });
}

export async function unregister() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const result = await registration.unregister();
    log('service worker unregistered', { result });
  } catch (e) {
    log('failed to unregister serviceworker', e);
  }
}
