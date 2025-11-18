/**
 * INTERNATIONALIZATION (i18n) CONFIGURATION
 *
 * Multi-language support for English (en) and Portuguese (pt-BR).
 * All user-facing text is defined here for easy translation and maintenance.
 *
 * USAGE:
 * Import the translations object and access text by locale:
 * translations[locale].common.welcome
 *
 * @module i18n.config
 */

/**
 * Supported locales in the application
 */
export const SUPPORTED_LOCALES = {
  EN: 'en',
  PT: 'pt',
} as const

export type Locale = typeof SUPPORTED_LOCALES[keyof typeof SUPPORTED_LOCALES]

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: Locale = SUPPORTED_LOCALES.EN

/**
 * Locale display names
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
}

/**
 * TRANSLATION OBJECT
 *
 * Organized by feature area for easy navigation.
 * Each key should be descriptive and follow a hierarchical structure.
 */
export const translations = {
  /** ENGLISH TRANSLATIONS */
  en: {
    /** Common UI text used throughout the app */
    common: {
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      confirm: 'Confirm',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      loading: 'Loading...',
      viewMore: 'View More',
      viewLess: 'View Less',
      learnMore: 'Learn More',
      readMore: 'Read More',
      showAll: 'Show All',

      // Status
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',

      // Common labels
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      state: 'State',
      country: 'Country',
      zipCode: 'ZIP Code',

      // Confirmation
      areYouSure: 'Are you sure?',
      cannotBeUndone: 'This action cannot be undone.',
    },

    /** Navigation and site structure */
    navigation: {
      home: 'Home',
      shop: 'Shop',
      products: 'Products',
      blog: 'Blog',
      about: 'About',
      contact: 'Contact',
      cart: 'Cart',
      checkout: 'Checkout',
      account: 'Account',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',

      // Admin
      admin: 'Admin',
      dashboard: 'Dashboard',
      orders: 'Orders',
      customers: 'Customers',
      settings: 'Settings',

      // Legal
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      refund: 'Refund Policy',
    },

    /** Homepage content */
    home: {
      hero: {
        title: 'Transform Your Life Through Discipline',
        subtitle: 'Science-based transformation system for modern men. Not temporary motivation—total reconstruction.',
        cta: 'Start Your Transformation',
        secondaryCta: 'Learn More',
      },
      valueProposition: {
        title: 'Why Alpha Grit?',
        subtitle: 'Real results through proven methods',
        item1: {
          title: 'Science-Based',
          description: 'Every method backed by research and real-world results.',
        },
        item2: {
          title: 'Actionable Steps',
          description: 'No fluff. Just clear, implementable strategies.',
        },
        item3: {
          title: 'Lifetime Access',
          description: 'One purchase, lifetime updates and support.',
        },
      },
      socialProof: {
        title: 'Trusted by Men Worldwide',
        transformations: 'Transformations',
        customers: 'Happy Customers',
        rating: 'Average Rating',
      },
      cta: {
        title: 'Ready to Transform?',
        subtitle: 'Join thousands of men who have already started their journey.',
        button: 'Get Started Now',
      },
    },

    /** Product-related text */
    products: {
      title: 'Our Products',
      subtitle: 'Digital products to accelerate your transformation',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      price: 'Price',
      salePrice: 'Sale Price',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      digital: 'Digital Product',
      instantAccess: 'Instant Access',

      // Product details
      details: 'Details',
      whatsIncluded: "What's Included",
      aboutAuthor: 'About the Author',
      reviews: 'Reviews',
      relatedProducts: 'Related Products',

      // Filters
      filterByPrice: 'Filter by Price',
      sortBy: 'Sort By',
      sortByPopular: 'Most Popular',
      sortByPriceLow: 'Price: Low to High',
      sortByPriceHigh: 'Price: High to Low',
      sortByNewest: 'Newest First',
    },

    /** Shopping cart */
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      itemsInCart: 'items in cart',
      itemAdded: 'Item added to cart',
      itemRemoved: 'Item removed from cart',
    },

    /** Checkout process */
    checkout: {
      title: 'Checkout',
      customerInfo: 'Customer Information',
      paymentInfo: 'Payment Information',
      reviewOrder: 'Review Order',
      placeOrder: 'Place Order',
      orderSummary: 'Order Summary',

      // Steps
      step1: 'Information',
      step2: 'Payment',
      step3: 'Review',

      // Success
      success: {
        title: 'Order Successful!',
        message: 'Thank you for your purchase. Check your email for order details.',
        viewOrder: 'View Order',
        continueShopping: 'Continue Shopping',
      },
    },

    /** User account */
    account: {
      title: 'My Account',
      profile: 'Profile',
      orders: 'Orders',
      ebooks: 'My E-books',
      settings: 'Settings',

      // Orders
      orderHistory: 'Order History',
      orderNumber: 'Order #',
      orderDate: 'Order Date',
      orderStatus: 'Status',
      orderTotal: 'Total',
      viewDetails: 'View Details',
      downloadProduct: 'Download Product',

      // Profile
      updateProfile: 'Update Profile',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
    },

    /** Authentication */
    auth: {
      signIn: {
        title: 'Sign In',
        subtitle: 'Welcome back! Sign in to your account',
        email: 'Email Address',
        password: 'Password',
        rememberMe: 'Remember Me',
        forgotPassword: 'Forgot Password?',
        submit: 'Sign In',
        noAccount: "Don't have an account?",
        createAccount: 'Create Account',
      },
      signUp: {
        title: 'Create Account',
        subtitle: 'Start your transformation journey today',
        name: 'Full Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        submit: 'Create Account',
        haveAccount: 'Already have an account?',
        signIn: 'Sign In',
        terms: 'By creating an account, you agree to our',
        and: 'and',
      },
    },

    /** Blog */
    blog: {
      title: 'Blog',
      subtitle: 'Insights, strategies, and stories',
      readMore: 'Read More',
      readTime: 'min read',
      postedOn: 'Posted on',
      by: 'by',
      categories: 'Categories',
      tags: 'Tags',
      relatedPosts: 'Related Posts',
      sharePost: 'Share this post',
    },

    /** Admin panel */
    admin: {
      dashboard: {
        title: 'Dashboard',
        revenue: 'Total Revenue',
        orders: 'Total Orders',
        customers: 'Total Customers',
        products: 'Total Products',
        recentOrders: 'Recent Orders',
      },
      products: {
        title: 'Products',
        addNew: 'Add New Product',
        edit: 'Edit Product',
        delete: 'Delete Product',
        basicInfo: 'Basic Information',
        pricing: 'Pricing',
        media: 'Media',
        seo: 'SEO',
        status: 'Status',
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
      },
    },

    /** Toast messages */
    toast: {
      success: {
        productAdded: 'Product added to cart',
        productRemoved: 'Product removed from cart',
        profileUpdated: 'Profile updated successfully',
        orderPlaced: 'Order placed successfully',
        refundRequested: 'Refund requested successfully',
        copied: 'Copied to clipboard',
      },
      error: {
        generic: 'Something went wrong. Please try again.',
        unauthorized: 'You must be logged in to do that',
        forbidden: 'You do not have permission to do that',
        notFound: 'Resource not found',
        network: 'Network error. Please check your connection.',
      },
    },

    /** Footer */
    footer: {
      tagline: 'Transform your life through discipline, strength, and relentless action.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      followUs: 'Follow Us',
      newsletter: {
        title: 'Stay Updated',
        subtitle: 'Get the latest insights and exclusive offers',
        placeholder: 'Enter your email',
        submit: 'Subscribe',
        success: 'Subscribed successfully!',
      },
      copyright: 'All rights reserved.',
    },
  },

  /** PORTUGUESE (BRAZIL) TRANSLATIONS */
  pt: {
    common: {
      // Ações
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      create: 'Criar',
      update: 'Atualizar',
      confirm: 'Confirmar',
      close: 'Fechar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      submit: 'Enviar',
      search: 'Buscar',
      filter: 'Filtrar',
      clear: 'Limpar',
      loading: 'Carregando...',
      viewMore: 'Ver Mais',
      viewLess: 'Ver Menos',
      learnMore: 'Saiba Mais',
      readMore: 'Ler Mais',
      showAll: 'Mostrar Tudo',

      // Status
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Aviso',
      info: 'Informação',

      // Rótulos comuns
      email: 'E-mail',
      password: 'Senha',
      name: 'Nome',
      phone: 'Telefone',
      address: 'Endereço',
      city: 'Cidade',
      state: 'Estado',
      country: 'País',
      zipCode: 'CEP',

      // Confirmação
      areYouSure: 'Tem certeza?',
      cannotBeUndone: 'Esta ação não pode ser desfeita.',
    },

    navigation: {
      home: 'Início',
      shop: 'Loja',
      products: 'Produtos',
      blog: 'Blog',
      about: 'Sobre',
      contact: 'Contato',
      cart: 'Carrinho',
      checkout: 'Finalizar',
      account: 'Conta',
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      signOut: 'Sair',

      admin: 'Admin',
      dashboard: 'Painel',
      orders: 'Pedidos',
      customers: 'Clientes',
      settings: 'Configurações',

      terms: 'Termos de Serviço',
      privacy: 'Política de Privacidade',
      refund: 'Política de Reembolso',
    },

    home: {
      hero: {
        title: 'Transforme Sua Vida Através da Disciplina',
        subtitle: 'Sistema de transformação baseado em ciência para homens modernos. Não é motivação temporária—é reconstrução total.',
        cta: 'Comece Sua Transformação',
        secondaryCta: 'Saiba Mais',
      },
      valueProposition: {
        title: 'Por Que Alpha Grit?',
        subtitle: 'Resultados reais através de métodos comprovados',
        item1: {
          title: 'Baseado em Ciência',
          description: 'Cada método respaldado por pesquisa e resultados do mundo real.',
        },
        item2: {
          title: 'Passos Acionáveis',
          description: 'Sem enrolação. Apenas estratégias claras e implementáveis.',
        },
        item3: {
          title: 'Acesso Vitalício',
          description: 'Uma compra, atualizações e suporte vitalícios.',
        },
      },
      socialProof: {
        title: 'Confiado por Homens no Mundo Todo',
        transformations: 'Transformações',
        customers: 'Clientes Satisfeitos',
        rating: 'Avaliação Média',
      },
      cta: {
        title: 'Pronto Para Transformar?',
        subtitle: 'Junte-se a milhares de homens que já começaram sua jornada.',
        button: 'Começar Agora',
      },
    },

    products: {
      title: 'Nossos Produtos',
      subtitle: 'Produtos digitais para acelerar sua transformação',
      addToCart: 'Adicionar ao Carrinho',
      buyNow: 'Comprar Agora',
      price: 'Preço',
      salePrice: 'Preço Promocional',
      inStock: 'Em Estoque',
      outOfStock: 'Fora de Estoque',
      digital: 'Produto Digital',
      instantAccess: 'Acesso Instantâneo',

      details: 'Detalhes',
      whatsIncluded: 'O Que Está Incluído',
      aboutAuthor: 'Sobre o Autor',
      reviews: 'Avaliações',
      relatedProducts: 'Produtos Relacionados',

      filterByPrice: 'Filtrar por Preço',
      sortBy: 'Ordenar Por',
      sortByPopular: 'Mais Popular',
      sortByPriceLow: 'Preço: Menor para Maior',
      sortByPriceHigh: 'Preço: Maior para Menor',
      sortByNewest: 'Mais Recentes',
    },

    cart: {
      title: 'Carrinho de Compras',
      empty: 'Seu carrinho está vazio',
      continueShopping: 'Continuar Comprando',
      subtotal: 'Subtotal',
      tax: 'Imposto',
      total: 'Total',
      checkout: 'Finalizar Compra',
      remove: 'Remover',
      quantity: 'Quantidade',
      itemsInCart: 'itens no carrinho',
      itemAdded: 'Item adicionado ao carrinho',
      itemRemoved: 'Item removido do carrinho',
    },

    checkout: {
      title: 'Finalizar Compra',
      customerInfo: 'Informações do Cliente',
      paymentInfo: 'Informações de Pagamento',
      reviewOrder: 'Revisar Pedido',
      placeOrder: 'Realizar Pedido',
      orderSummary: 'Resumo do Pedido',

      step1: 'Informações',
      step2: 'Pagamento',
      step3: 'Revisão',

      success: {
        title: 'Pedido Realizado com Sucesso!',
        message: 'Obrigado pela sua compra. Verifique seu e-mail para detalhes do pedido.',
        viewOrder: 'Ver Pedido',
        continueShopping: 'Continuar Comprando',
      },
    },

    account: {
      title: 'Minha Conta',
      profile: 'Perfil',
      orders: 'Pedidos',
      ebooks: 'Meus E-books',
      settings: 'Configurações',

      orderHistory: 'Histórico de Pedidos',
      orderNumber: 'Pedido #',
      orderDate: 'Data do Pedido',
      orderStatus: 'Status',
      orderTotal: 'Total',
      viewDetails: 'Ver Detalhes',
      downloadProduct: 'Baixar Produto',

      updateProfile: 'Atualizar Perfil',
      changePassword: 'Alterar Senha',
      currentPassword: 'Senha Atual',
      newPassword: 'Nova Senha',
      confirmPassword: 'Confirmar Senha',
    },

    auth: {
      signIn: {
        title: 'Entrar',
        subtitle: 'Bem-vindo de volta! Entre na sua conta',
        email: 'Endereço de E-mail',
        password: 'Senha',
        rememberMe: 'Lembrar-me',
        forgotPassword: 'Esqueceu a Senha?',
        submit: 'Entrar',
        noAccount: 'Não tem uma conta?',
        createAccount: 'Criar Conta',
      },
      signUp: {
        title: 'Criar Conta',
        subtitle: 'Comece sua jornada de transformação hoje',
        name: 'Nome Completo',
        email: 'Endereço de E-mail',
        password: 'Senha',
        confirmPassword: 'Confirmar Senha',
        submit: 'Criar Conta',
        haveAccount: 'Já tem uma conta?',
        signIn: 'Entrar',
        terms: 'Ao criar uma conta, você concorda com nossos',
        and: 'e',
      },
    },

    blog: {
      title: 'Blog',
      subtitle: 'Insights, estratégias e histórias',
      readMore: 'Ler Mais',
      readTime: 'min de leitura',
      postedOn: 'Publicado em',
      by: 'por',
      categories: 'Categorias',
      tags: 'Tags',
      relatedPosts: 'Posts Relacionados',
      sharePost: 'Compartilhar este post',
    },

    admin: {
      dashboard: {
        title: 'Painel',
        revenue: 'Receita Total',
        orders: 'Pedidos Totais',
        customers: 'Clientes Totais',
        products: 'Produtos Totais',
        recentOrders: 'Pedidos Recentes',
      },
      products: {
        title: 'Produtos',
        addNew: 'Adicionar Novo Produto',
        edit: 'Editar Produto',
        delete: 'Excluir Produto',
        basicInfo: 'Informações Básicas',
        pricing: 'Preços',
        media: 'Mídia',
        seo: 'SEO',
        status: 'Status',
        draft: 'Rascunho',
        published: 'Publicado',
        archived: 'Arquivado',
      },
    },

    toast: {
      success: {
        productAdded: 'Produto adicionado ao carrinho',
        productRemoved: 'Produto removido do carrinho',
        profileUpdated: 'Perfil atualizado com sucesso',
        orderPlaced: 'Pedido realizado com sucesso',
        refundRequested: 'Reembolso solicitado com sucesso',
        copied: 'Copiado para a área de transferência',
      },
      error: {
        generic: 'Algo deu errado. Tente novamente.',
        unauthorized: 'Você precisa estar logado para fazer isso',
        forbidden: 'Você não tem permissão para fazer isso',
        notFound: 'Recurso não encontrado',
        network: 'Erro de rede. Verifique sua conexão.',
      },
    },

    footer: {
      tagline: 'Transforme sua vida através da disciplina, força e ação implacável.',
      quickLinks: 'Links Rápidos',
      legal: 'Legal',
      followUs: 'Siga-nos',
      newsletter: {
        title: 'Fique Atualizado',
        subtitle: 'Receba as últimas novidades e ofertas exclusivas',
        placeholder: 'Digite seu e-mail',
        submit: 'Inscrever-se',
        success: 'Inscrito com sucesso!',
      },
      copyright: 'Todos os direitos reservados.',
    },
  },
} as const

/** Type for translation keys */
export type TranslationKeys = typeof translations.en

/** Type-safe translation getter */
export type Translations = typeof translations

export default translations
