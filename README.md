# Pdfun

<!-- prettier-ignore-start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- prettier-ignore-end -->

[![Twitter](https://img.shields.io/twitter/follow/PDFun_xyz)](https://twitter.com/PDFun_xyz)

Open source PDF services. Built with:

- Analogjs (Angular)
- Nx Workspace
- Firebase
- GCP

![PDFun Demo](/docs/images/pdfun.png)

## Deploy applications

```
yarn deploy
```

## Local development (Web)

First, you need to rename the `.env-template` to `.env` and update the environment file.

> Tip: to turn Firebase service account to string for the environment, you can run `JSON.stringify(SERVICE_ACCOUNT_OBJECT)`.

After that, you can run `yarn deploy:rules` to deploy Firestore & Cloud Storage security rules.

## Local development (API)

Run the following command to set the default credentials

```
gcloud auth application-default login
```

OR you create a new service account and use it locally

```
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"

```

## Contributing

PDFun welcomes contributors! Please read the [contributing doc](https://github.com/dalenguyen/pdfun/blob/main/CONTRIBUTING.md) for details.

## [Roadmap](https://github.com/users/dalenguyen/projects/5)

<a href="https://www.buymeacoffee.com/dalef" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://dalenguyen.me"><img src="https://avatars.githubusercontent.com/u/14116156?v=4?s=100" width="100px;" alt="Dale Nguyen"/><br /><sub><b>Dale Nguyen</b></sub></a><br /><a href="https://github.com/dalenguyen/pdfun/commits?author=dalenguyen" title="Code">💻</a> <a href="https://github.com/dalenguyen/pdfun/commits?author=dalenguyen" title="Documentation">📖</a> <a href="#ideas-dalenguyen" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://brandonroberts.dev"><img src="https://avatars.githubusercontent.com/u/42211?v=4?s=100" width="100px;" alt="Brandon Roberts"/><br /><sub><b>Brandon Roberts</b></sub></a><br /><a href="https://github.com/dalenguyen/pdfun/commits?author=brandonroberts" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://monacodelisa.com/"><img src="https://avatars.githubusercontent.com/u/64324417?v=4?s=100" width="100px;" alt="Esther White"/><br /><sub><b>Esther White</b></sub></a><br /><a href="https://github.com/dalenguyen/pdfun/commits?author=monacodelisa" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://letsprogram.in"><img src="https://avatars.githubusercontent.com/u/21971232?v=4?s=100" width="100px;" alt="Sashikumar Yadav"/><br /><sub><b>Sashikumar Yadav</b></sub></a><br /><a href="https://github.com/dalenguyen/pdfun/commits?author=yshashi" title="Code">💻</a> <a href="#design-yshashi" title="Design">🎨</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
