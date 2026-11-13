import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { if (!localStorage.getItem('p2s-quality')) localStorage.setItem('p2s-quality', 'low') })
})

test('Terre, orbite manuelle, changements rapides, pause et retour général', async ({ page }) => {
  const errors: string[] = [], failed: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()) })
  await page.goto('./')
  await expect(page.getByRole('heading', { name: /Le cosmos/ })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByText('L’EXPLORATION EST À VOUS')).toBeVisible()
  await page.getByRole('button', { name: 'Découvrir la Terre' }).click()
  await expect(page.getByRole('complementary', { name: 'Fiche de Terre' })).toBeVisible()
  await expect(page.getByText('12 756 km')).toBeAttached()
  await page.getByRole('button', { name: 'Mettre en pause', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Reprendre la simulation' })).toHaveAttribute('aria-pressed', 'true')
  // Wait for the real cinematic transition, then exercise the actual WebGL controls.
  const canvas = page.locator('canvas')
  await expect(canvas).toHaveAttribute('aria-busy', 'false')
  await expect(canvas).toHaveAttribute('data-focus', 'earth')
  const before = await canvas.screenshot()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas absent')
  await page.mouse.move(box.width * .5, box.height * .3)
  await page.mouse.down()
  await page.mouse.move(box.width * .6, box.height * .34, { steps: 8 })
  await page.mouse.up()
  await page.mouse.wheel(0, -180)
  await page.waitForTimeout(500)
  expect((await canvas.screenshot()).equals(before)).toBe(false)
  for (const name of ['Jupiter', 'Terre', 'Jupiter', 'Saturne']) {
    await page.getByRole('button', { name: `Explorer ${name}`, exact: true }).click()
  }
  await expect(page.getByRole('complementary', { name: 'Fiche de Saturne' })).toBeVisible()
  await expect(canvas).toHaveAttribute('aria-busy', 'false')
  await expect(canvas).toHaveAttribute('data-focus', 'saturn')
  await expect(page.getByRole('button', { name: 'Explorer Saturne', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Astre suivant', exact: true }).click()
  await expect(page.getByRole('complementary', { name: 'Fiche de Uranus' })).toBeVisible()
  await page.getByRole('button', { name: 'Fermer la fiche' }).click()
  await expect(page.getByRole('heading', { name: 'Le système solaire.' })).toBeVisible()
  await expect(page.getByRole('complementary')).toHaveCount(0)
  await expect(canvas).toHaveAttribute('data-focus', 'overview')
  await page.locator('.scene-label').filter({ hasText: /^Terre$/ }).click()
  await expect(page.getByRole('complementary', { name: 'Fiche de Terre' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('complementary')).toHaveCount(0)
  expect(errors).toEqual([])
  expect(failed).toEqual([])
})

test('réglages persistants, qualité, labels et chargement 2K à la demande', async ({ page }) => {
  const textures: string[] = []
  page.on('request', request => { if (request.url().includes('/textures/2k/')) textures.push(request.url()) })
  await page.goto('./')
  await page.getByRole('button', { name: 'Découvrir la Terre' }).click()
  await page.getByRole('button', { name: 'Réglages', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByLabel('Qualité graphique').selectOption('high')
  await page.getByLabel('Afficher les noms des astres').uncheck()
  await page.getByLabel('Accéder directement à l’exploration').check()
  await page.getByRole('button', { name: 'Fermer les réglages' }).click()
  await expect.poll(() => textures.some(url => url.endsWith('/earth.jpg'))).toBe(true)
  expect(textures.some(url => url.endsWith('/neptune.jpg'))).toBe(false)
  await expect(page.locator('.scene-label')).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Le système solaire.' })).toBeVisible()
  await page.getByRole('button', { name: 'Réglages', exact: true }).click()
  await expect(page.getByLabel('Qualité graphique')).toHaveValue('high')
  await expect(page.getByLabel('Afficher les noms des astres')).not.toBeChecked()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('mouvements réduits et navigation clavier', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Le système solaire.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reprendre la simulation' })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('complementary', { name: 'Fiche de Mercure' })).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('complementary', { name: 'Fiche de Soleil' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('complementary')).toHaveCount(0)
})

test('WebGL indisponible : les fiches restent utilisables', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes('webgl')) return null
      return original.apply(this, [type, ...args] as Parameters<typeof original>)
    } as typeof original
  })
  await page.goto('./')
  await expect(page.getByText('Le rendu 3D est indisponible sur cet appareil.')).toBeVisible()
  await page.getByRole('button', { name: 'Explorer Terre', exact: true }).click()
  await expect(page.getByRole('complementary', { name: 'Fiche de Terre' })).toBeVisible()
})

test('texture manquante : repli coloré et message accessible', async ({ page }) => {
  await page.route('**/textures/1k/earth.jpg', route => route.fulfill({ status: 404, body: '' }))
  await page.goto('./')
  await expect(page.getByText('Certaines textures n’ont pas pu être chargées.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Explorer Terre', exact: true }).click()
  await expect(page.getByRole('complementary', { name: 'Fiche de Terre' })).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
})
