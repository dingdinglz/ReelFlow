import { defineCollection, z } from '@nuxt/content'

const variantEnum = z.enum(['solid', 'outline', 'subtle', 'soft', 'ghost', 'link'])
const colorEnum = z.enum(['primary', 'secondary', 'neutral', 'error', 'warning', 'success', 'info'])
const sizeEnum = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])
const orientationEnum = z.enum(['vertical', 'horizontal'])

const createBaseSchema = () => z.object({
    title: z.string().nonempty(),
    description: z.string().nonempty()
})

const createFeatureItemSchema = () => createBaseSchema().extend({
    icon: z.string().nonempty().editor({ input: 'icon' })
})

const createLinkSchema = () => z.object({
    label: z.string().nonempty(),
    to: z.string().nonempty(),
    icon: z.string().optional().editor({ input: 'icon' }),
    size: sizeEnum.optional(),
    trailing: z.boolean().optional(),
    target: z.string().optional(),
    color: colorEnum.optional(),
    variant: variantEnum.optional()
})

const createImageSchema = () => z.object({
    src: z.string().nonempty().editor({ input: 'media' }),
    alt: z.string().optional(),
    loading: z.string().optional(),
    srcset: z.string().optional()
})

// 定义 changelog 项的 schema
const createChangelogItemSchema = () => z.object({
    version: z.string().nonempty(),
    date: z.string().nonempty(),
    badge: z.object({
        label: z.string().nonempty(),
        color: colorEnum.optional()
    }).optional(),
    content: z.string().nonempty()
})

export const collections = {
    index: defineCollection({
        source: 'index.yml',
        type: 'page',
        schema: z.object({
            hero: z.object(({
                links: z.array(createLinkSchema())
            })),
            sections: z.array(
                createBaseSchema().extend({
                    id: z.string().nonempty(),
                    orientation: orientationEnum.optional(),
                    reverse: z.boolean().optional(),
                    features: z.array(createFeatureItemSchema())
                })
            ),
            features: createBaseSchema().extend({
                items: z.array(createFeatureItemSchema())
            }),
            testimonials: createBaseSchema().extend({
                headline: z.string().optional(),
                items: z.array(
                    z.object({
                        quote: z.string().nonempty(),
                        user: z.object({
                            name: z.string().nonempty(),
                            description: z.string().nonempty(),
                            to: z.string().nonempty(),
                            target: z.string().nonempty(),
                            avatar: createImageSchema()
                        })
                    })
                )
            }),
            cta: createBaseSchema().extend({
                links: z.array(createLinkSchema())
            })
        })
    }),
    changelog: defineCollection({
        source: 'changelog.yml',
        type: 'page',
        schema: z.object({
            items: z.array(createChangelogItemSchema())
        })
    })
}