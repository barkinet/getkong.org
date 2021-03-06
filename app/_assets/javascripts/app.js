$(function () {
  var $window = $(window);

  $('.navbar-toggle').on('click', function () {
    var $navbar = $($(this).data('target'));
    $navbar.slideToggle(150);
  });

  $('.scroll-to').on('click', function (e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 70 // Header height
    }, 700);
  });

  // Change header download button color

  if (!$('body#enterprise').length) {
    var introSectionHeight = $('.section.intro-section').outerHeight() || 50;
    var $downloadBtn = $('.navbar-nav').find('.button');

    $window.on('scroll', function () {
      var scrollTop = $(this).scrollTop();

      if (scrollTop > introSectionHeight) {
        $downloadBtn.removeClass('button-dark').addClass('button-primary');
      } else {
        $downloadBtn.removeClass('button-primary').addClass('button-dark');
      }
    });
  }

  // Page section on contribute page

  $('.toggle-page-section').on('click', function (e) {
    e.preventDefault();
    var $link = $(this);

    $link.parent().next('.page-section').stop().slideToggle(300, function () {
      $link.toggleClass('active');
    });
  });

  // Tabs on download page

  var $tabs = $('.tab-list li');
  var $tabPanes = $('.tab-pane');

  $tabs.on('click', function (e, disableTracking) {
    e.preventDefault();

    var tabId = $(this).find('a').attr('href');

    $tabs.removeClass('active').filter(this).addClass('active');
    $tabPanes.removeClass('active').filter(tabId).addClass('active');

    if (history.pushState) {
      history.pushState(null, null, tabId);
    } else {
      location.hash = tabId;
    }

    if (!disableTracking) {
      analytics.track('Choose installation method', {
        installationMethod: tabId.substr(1)
      });
    }
  });

  if (location.hash) {
    $tabs.find('a[href="' + location.hash + '"]').trigger('click', true);
  }

  // Subscribe form

  $('.subscribe-form').on('submit', function (e) {
    e.preventDefault();

    var $form = $(this);
    var email = $form.find('[name="email"]').val();
    var submitTime = new Date().toString();

    analytics.identify(email, {
      email: email,
      environment: 'kong',
      newsletter_updates: true,
      created_at: submitTime
    }, function () {
      $form.fadeOut(300, function () {
        $('.success-message').fadeIn(300);
      });

      analytics.track('request_newsletter_updates', {
        email: email,
        request_date: submitTime
      });
    });
  });

  // Enterprise page demo request form

  $('.demo-request-form').on('submit', function (e) {
    e.preventDefault();

    var $form = $(this);
    var data = $form.serializeArray();
    var submitTime = new Date().toString();
    var payload = {};
    var analyticsDfd = $.Deferred();
    var fieldValues = {};
    var relateiqFieldIds = {
      title: 7,
      tell_us_more: 8,
      email: 9,
      phone: 10,
      deployment: 11,
      company: 12,
      name: 14
    };

    for (var i = 0; i < data.length; i++) {
      payload[data[i].name] = data[i].value;
    }

    analytics.identify(payload.email, $.extend({
      environment: 'kong',
      enterprise: true,
      created_at: submitTime
    }, payload), function () {
      analytics.track('request_enterprise_demo', $.extend({
        request_date: submitTime
      }, payload), analyticsDfd.resolve);
    });

    for (var field in payload) {
      if (payload[field]) {
        fieldValues[relateiqFieldIds[field]] = [{
          raw: payload[field]
        }];
      }
    }

    var relateiqDfd = $.ajax({
      url: 'https://mashaper-relateiq-v1.p.mashape.com/accounts',
      method: 'POST',
      headers: {
        'authorization': 'Basic NTU0MWViNjZlNGIwNjlmYmVhZmYwY2M1OkY3WW0xNDIwY041UUZSRDRZaUpnMjRxUTcxUQ==',
        'x-mashape-key': 'mJUINHSWBYmshREqNlfTBKtbBHDZp1N7VKhjsnUIUo4f4r3pVj'
      },
      data: JSON.stringify({
        name: payload.email,
        fieldValues: fieldValues
      })
    });

    $.when.apply($, [analyticsDfd, relateiqDfd]).then(function () {
      $form.fadeOut(300, function () {
        $('.success-message').fadeIn(300);
      }).siblings('.section-header').fadeOut(300);
    });
  });

  // Analytics

  $('[href^="/download"]').each(function () {
    var $link = $(this);

    analytics.trackLink(this, 'Clicked download', {
      section: $link.closest('.navbar').length ? 'header' : 'page',
      pathname: location.pathname,
      type: $link.hasClass('button') ? 'button' : 'link'
    });
  });

  analytics.track(
      'Viewed ' + $.trim(document.title.split('|').shift()) + ' page'
  );

  $('.plugin-plate-link').each(function () {
    analytics.trackLink(this, 'Click on plugin', {
      plugin_type: $(this).closest('.plugin-plate').find('h3').text()
    });
  });

  $('#documentation .page-navigation a').each(function () {
    analytics.trackLink(this, 'Click documentation link', {
      documentation_name: $(this).text()
    });
  });

  $('.community-plate a').each(function () {
    analytics.trackLink(this, 'Click community link', {
      community_type: $.trim($(this).closest('.community-plate').find('h4').text())
    });
  });

  analytics.trackLink($('a[href="#comparison"]')[0], 'Clicked Why Kong');
});
