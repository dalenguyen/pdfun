import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'pdf-newsletter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="mc_embed_shell">
      <link
        href="//cdn-images.mailchimp.com/embedcode/classic-061523.css"
        rel="stylesheet"
        type="text/css"
      />
      <div id="mc_embed_signup">
        <form
          action="https://dalenguyen.us22.list-manage.com/subscribe/post?u=49b3ecec83906126621e45360&amp;id=c47c6195bc&amp;f_id=0089c9e1f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          class="validate"
          target="_blank"
        >
          <div id="mc_embed_signup_scroll">
            <h2>Subscribe for updates!</h2>
            <div class="mc-field-group">
              <label for="mce-EMAIL"
                >Email Address <span class="asterisk">*</span></label
              ><input
                type="email"
                name="EMAIL"
                class="required email"
                id="mce-EMAIL"
                required=""
                value=""
              />
            </div>
            <div id="mce-responses" class="clear foot">
              <div
                class="response"
                id="mce-error-response"
                style="display: none;"
              ></div>
              <div
                class="response"
                id="mce-success-response"
                style="display: none;"
              ></div>
            </div>
            <div aria-hidden="true" style="position: absolute; left: -5000px;">
              /* real people should not fill this in and expect good things - do
              not remove this or risk form bot signups */
              <input
                type="text"
                name="b_49b3ecec83906126621e45360_c47c6195bc"
                tabindex="-1"
                value=""
              />
            </div>
            <div class="optionalParent">
              <div class="clear foot">
                <input
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  class="button"
                  value="Subscribe"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <script
        type="text/javascript"
        src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
      ></script>
      <script type="text/javascript">
        ;(function ($) {
          window.fnames = new Array()
          window.ftypes = new Array()
          fnames[0] = 'EMAIL'
          ftypes[0] = 'email'
          fnames[1] = 'FNAME'
          ftypes[1] = 'text'
          fnames[2] = 'LNAME'
          ftypes[2] = 'text'
          fnames[3] = 'ADDRESS'
          ftypes[3] = 'address'
          fnames[4] = 'PHONE'
          ftypes[4] = 'phone'
          fnames[5] = 'BIRTHDAY'
          ftypes[5] = 'birthday'
        })(jQuery)
        var $mcj = jQuery.noConflict(true)
      </script>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent {}
